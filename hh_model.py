import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import odeint

# --- Parameters ---
C_m  =   1.0 # Membrane capacitance, in uF/cm^2
g_Na = 120.0 # Maximum sodium conductance, in mS/cm^2
g_K  =  36.0 # Maximum potassium conductance, in mS/cm^2
g_L  =   0.3 # Maximum leak conductance, in mS/cm^2
E_Na =  50.0 # Sodium Nernst reversal potential, in mV
E_K  = -77.0 # Potassium Nernst reversal potential, in mV
E_L  = -54.387 # Leak Nernst reversal potential, in mV

# --- Rate Functions ---
def alpha_m(V): return 0.1*(V+40.0)/(1.0 - np.exp(-(V+40.0)/10.0))
def beta_m(V):  return 4.0*np.exp(-(V+65.0)/18.0)
def alpha_h(V): return 0.07*np.exp(-(V+65.0)/20.0)
def beta_h(V):  return 1.0/(1.0 + np.exp(-(V+35.0)/10.0))
def alpha_n(V): return 0.01*(V+55.0)/(1.0 - np.exp(-(V+55.0)/10.0))
def beta_n(V):  return 0.125*np.exp(-(V+65)/80.0)

# --- External Current ---
def I_ext(t):
    """External current injection"""
    if 10 <= t <= 40:
        return 10.0 # uA/cm^2
    return 0.0

# --- ODE System ---
def dALLdt(X, t):
    V, m, h, n = X
    
    # Calculate currents
    I_Na = g_Na * m**3 * h * (V - E_Na)
    I_K  = g_K  * n**4 * (V - E_K)
    I_L  = g_L  * (V - E_L)
    
    # Derivatives
    dVdt = (I_ext(t) - I_Na - I_K - I_L) / C_m
    dmdt = alpha_m(V)*(1.0-m) - beta_m(V)*m
    dhdt = alpha_h(V)*(1.0-h) - beta_h(V)*h
    dndt = alpha_n(V)*(1.0-n) - beta_n(V)*n
    
    return [dVdt, dmdt, dhdt, dndt]

# --- Initial Conditions & Time Vector ---
V0 = -65.0
m0 = alpha_m(V0)/(alpha_m(V0)+beta_m(V0))
h0 = alpha_h(V0)/(alpha_h(V0)+beta_h(V0))
n0 = alpha_n(V0)/(alpha_n(V0)+beta_n(V0))
X0 = [V0, m0, h0, n0]

t = np.arange(0.0, 50.0, 0.01)

# --- Solve ODE ---
X = odeint(dALLdt, X0, t)
V = X[:,0]
m = X[:,1]
h = X[:,2]
n = X[:,3]

# --- Plotting ---
plt.figure(figsize=(12, 8))

# Plot Voltage
plt.subplot(3, 1, 1)
plt.title('Hodgkin-Huxley Model Simulation')
plt.plot(t, V, 'k')
plt.ylabel('V (mV)')
plt.grid(True)

# Plot Gating Variables
plt.subplot(3, 1, 2)
plt.plot(t, m, 'r', label='m (Na act)')
plt.plot(t, h, 'g', label='h (Na inact)')
plt.plot(t, n, 'b', label='n (K act)')
plt.ylabel('Gating Value')
plt.legend()
plt.grid(True)

# Plot External Current
plt.subplot(3, 1, 3)
I_inj = [I_ext(ti) for ti in t]
plt.plot(t, I_inj, 'orange')
plt.ylabel('I_ext (uA/cm^2)')
plt.xlabel('t (ms)')
plt.grid(True)

plt.tight_layout()
plt.show()
