import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

export function FormulaDisplay() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-y-auto max-h-[80vh]">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Hodgkin-Huxley Model Formulas
      </h2>

      <div className="space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            1. Equivalent Circuit & Current Equation
          </h3>
          <p className="mb-2">
            The cell membrane is modeled as an electrical circuit with capacitance <InlineMath math="C_m" /> and parallel ion channels. The total membrane current is the sum of the capacitive current and ionic currents:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl">
            <BlockMath math="C_m \frac{dV}{dt} = I_{ext} - I_{Na} - I_K - I_L" />
          </div>
          <p className="mt-2">
            Where the ionic currents are given by Ohm's law:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl mt-2">
            <BlockMath math="I_{Na} = \bar{g}_{Na} m^3 h (V - E_{Na})" />
            <BlockMath math="I_K = \bar{g}_K n^4 (V - E_K)" />
            <BlockMath math="I_L = \bar{g}_L (V - E_L)" />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            2. Gating Variables
          </h3>
          <p className="mb-2">
            The probabilities of channel gates being open are described by variables <InlineMath math="m" /> (Na activation), <InlineMath math="h" /> (Na inactivation), and <InlineMath math="n" /> (K activation). They follow first-order kinetics:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl">
            <BlockMath math="\frac{dx}{dt} = \alpha_x(V)(1-x) - \beta_x(V)x \quad \text{for } x \in \{m, h, n\}" />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            3. Rate Constants
          </h3>
          <p className="mb-2">
            The voltage-dependent transition rates <InlineMath math="\alpha" /> and <InlineMath math="\beta" /> (in ms<InlineMath math="^{-1}" />) are empirically derived (assuming resting potential around -65 mV):
          </p>
          <div className="bg-slate-50 p-4 rounded-xl space-y-4">
            <div>
              <p className="font-semibold text-sm text-slate-500 mb-1">Potassium (K) Activation:</p>
              <BlockMath math="\alpha_n(V) = \frac{0.01(V+55)}{1 - \exp(-(V+55)/10)}" />
              <BlockMath math="\beta_n(V) = 0.125 \exp(-(V+65)/80)" />
            </div>
            <div className="border-t border-slate-200 pt-4">
              <p className="font-semibold text-sm text-slate-500 mb-1">Sodium (Na) Activation:</p>
              <BlockMath math="\alpha_m(V) = \frac{0.1(V+40)}{1 - \exp(-(V+40)/10)}" />
              <BlockMath math="\beta_m(V) = 4 \exp(-(V+65)/18)" />
            </div>
            <div className="border-t border-slate-200 pt-4">
              <p className="font-semibold text-sm text-slate-500 mb-1">Sodium (Na) Inactivation:</p>
              <BlockMath math="\alpha_h(V) = 0.07 \exp(-(V+65)/20)" />
              <BlockMath math="\beta_h(V) = \frac{1}{1 + \exp(-(V+35)/10)}" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
