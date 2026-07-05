export interface Algorithm {
  id: string;
  name: string;
  tagline: string;
  description: string;
  complexity: string;
  code: string;
}

export const algorithms: Algorithm[] = [
  {
    id: "grover",
    name: "Grover's Search",
    tagline: "Quadratic speedup for unstructured search",
    complexity: "O(√N)",
    description:
      "Grover's algorithm amplifies the amplitude of a marked state through repeated oracle and diffusion steps. We implement it in Qiskit and visualize how the state vector rotates toward the solution with each iteration.",
    code: `from qiskit import QuantumCircuit
from qiskit.circuit.library import GroverOperator, MCMTGate, ZGate

def grover_circuit(n: int, marked: str) -> QuantumCircuit:
    """Build a Grover search over n qubits for one marked state."""
    oracle = QuantumCircuit(n)
    for i, bit in enumerate(reversed(marked)):
        if bit == "0":
            oracle.x(i)
    oracle.compose(MCMTGate(ZGate(), n - 1, 1), inplace=True)
    for i, bit in enumerate(reversed(marked)):
        if bit == "0":
            oracle.x(i)

    grover_op = GroverOperator(oracle)
    qc = QuantumCircuit(n)
    qc.h(range(n))                      # uniform superposition
    iterations = int((3.1416 / 4) * (2 ** (n / 2)))
    for _ in range(iterations):
        qc.compose(grover_op, inplace=True)
    qc.measure_all()
    return qc`,
  },
  {
    id: "vqe",
    name: "Variational Quantum Eigensolver",
    tagline: "Hybrid quantum-classical ground states",
    complexity: "Hybrid loop",
    description:
      "VQE finds the lowest eigenvalue of a Hamiltonian by pairing a parameterized quantum circuit with a classical optimizer. Our team uses it to estimate molecular ground-state energies and to study ansatz expressibility.",
    code: `from qiskit.circuit.library import efficient_su2
from qiskit.quantum_info import SparsePauliOp
from qiskit.primitives import StatevectorEstimator
from scipy.optimize import minimize

# H2 molecule Hamiltonian in the Pauli basis
hamiltonian = SparsePauliOp.from_list([
    ("II", -1.0523), ("IZ", 0.3979), ("ZI", -0.3979),
    ("ZZ", -0.0113), ("XX", 0.1809),
])

ansatz = efficient_su2(2, reps=2)
estimator = StatevectorEstimator()

def energy(params):
    job = estimator.run([(ansatz, hamiltonian, params)])
    return job.result()[0].data.evs

result = minimize(energy, x0=[0.1] * ansatz.num_parameters,
                  method="COBYLA")
print(f"Ground state energy: {result.fun:.4f} Ha")`,
  },
  {
    id: "qaoa",
    name: "QAOA",
    tagline: "Approximate optimization on near-term devices",
    complexity: "p-layer ansatz",
    description:
      "The Quantum Approximate Optimization Algorithm alternates cost and mixer layers to solve combinatorial problems like Max-Cut. We benchmark solution quality against circuit depth on simulators and IBM Quantum hardware.",
    code: `from qiskit import QuantumCircuit
import numpy as np

def qaoa_maxcut(edges, gamma, beta, n: int) -> QuantumCircuit:
    """One QAOA layer for Max-Cut on a graph."""
    qc = QuantumCircuit(n)
    qc.h(range(n))                      # start in |+...+>

    for u, v in edges:                  # cost unitary e^{-i gamma C}
        qc.cx(u, v)
        qc.rz(2 * gamma, v)
        qc.cx(u, v)

    qc.rx(2 * beta, range(n))           # mixer unitary e^{-i beta B}
    qc.measure_all()
    return qc

ring = [(0, 1), (1, 2), (2, 3), (3, 0)]
qc = qaoa_maxcut(ring, gamma=np.pi / 5, beta=np.pi / 8, n=4)`,
  },
];
