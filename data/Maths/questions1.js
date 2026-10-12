/* ==========================================================
   data/Maths/questions1.js
   Quiz format matching the current site: q = question, a = correct, w = wrong choices.
   The original worksheet exams are registered in window.EXAMS below.
   ========================================================== */
window.QUESTIONS = window.QUESTIONS || {};
Object.assign(window.QUESTIONS, {
  "math-1": [
    {
      "q": "Which set contains both rational and irrational real numbers?",
      "a": "R",
      "w": [
        "N",
        "Z",
        "Q"
      ]
    },
    {
      "q": "Which interval includes both endpoints a and b?",
      "a": "[a, b]",
      "w": [
        "(a, b)",
        "[a, b)",
        "(a, b]"
      ]
    },
    {
      "q": "For a ≠ 0, what is a⁻ⁿ equal to?",
      "a": "1/aⁿ",
      "w": [
        "−aⁿ",
        "a/n",
        "1/(an)"
      ]
    },
    {
      "q": "Simplify (a+b)².",
      "a": "a² + 2ab + b²",
      "w": [
        "a² + b²",
        "a² − 2ab + b²",
        "a² + ab + b²"
      ]
    },
    {
      "q": "What is the degree of 4x³ − 2x + 1?",
      "a": "3",
      "w": [
        "1",
        "2",
        "4"
      ]
    },
    {
      "q": "Which is the factorization of a²−b²?",
      "a": "(a−b)(a+b)",
      "w": [
        "(a−b)²",
        "(a+b)²",
        "(a−b)(a−b)"
      ]
    },
    {
      "q": "The quadratic formula for ax²+bx+c=0 is",
      "a": "(−b ± √(b²−4ac))/(2a)",
      "w": [
        "(b ± √(b²+4ac))/(2a)",
        "(−b ± √(b²−4ac))/a",
        "(−b ± √(b²+4ac))/(2a)"
      ]
    },
    {
      "q": "If Δ=b²−4ac is negative, the quadratic equation has",
      "a": "No real roots",
      "w": [
        "Two distinct real roots",
        "One repeated real root",
        "Always two positive roots"
      ]
    }
  ],
  "math-2": [
    {
      "q": "When multiplying both sides of an inequality by a negative number, you must",
      "a": "Reverse the inequality sign",
      "w": [
        "Keep the sign unchanged",
        "Replace the sign with =",
        "Square both sides"
      ]
    },
    {
      "q": "The solution of x ≥ 2 in interval notation is",
      "a": "[2, ∞)",
      "w": [
        "(2, ∞)",
        "(−∞, 2]",
        "[−∞, 2]"
      ]
    },
    {
      "q": "The word “and” in a compound inequality usually means",
      "a": "Intersection of solution sets",
      "w": [
        "Union of solution sets",
        "No solution in every case",
        "Multiply the inequalities"
      ]
    },
    {
      "q": "For (x−1)(x+3)>0, the solution is",
      "a": "x < −3 or x > 1",
      "w": [
        "−3 < x < 1",
        "x ≤ −3 or x ≥ 1",
        "x = −3 or x = 1"
      ]
    },
    {
      "q": "Which is always true for any real x?",
      "a": "|x| ≥ 0",
      "w": [
        "|x| < 0",
        "|x| = −1",
        "|x| ≤ −2"
      ]
    },
    {
      "q": "The expression (x+1)/(x−2) is undefined at",
      "a": "x = 2",
      "w": [
        "x = −1",
        "x = 0",
        "x = 1"
      ]
    },
    {
      "q": "For |A| < c with c > 0, an equivalent inequality is",
      "a": "−c < A < c",
      "w": [
        "A < −c or A > c",
        "A < c only",
        "A = ±c only"
      ]
    },
    {
      "q": "If two inequalities joined by “and” have no common values, the solution set is",
      "a": "∅",
      "w": [
        "R",
        "(−∞, ∞)",
        "{0}"
      ]
    }
  ],
  "math-3": [
    {
      "q": "In a function, each allowed input must have",
      "a": "Exactly one output",
      "w": [
        "At least two outputs",
        "No output ever",
        "A negative output"
      ]
    },
    {
      "q": "For f:A→B, the domain is",
      "a": "A",
      "w": [
        "B",
        "The range only",
        "The y-axis"
      ]
    },
    {
      "q": "The range of a function is",
      "a": "The set of outputs actually attained",
      "w": [
        "Every value in the codomain in all cases",
        "The set of inputs",
        "Always the real numbers"
      ]
    },
    {
      "q": "The graph of −f(x) is reflected across the",
      "a": "x-axis",
      "w": [
        "y-axis",
        "line y=x",
        "origin only"
      ]
    },
    {
      "q": "The graph of f(x−h), h>0, shifts",
      "a": "Right by h units",
      "w": [
        "Left by h units",
        "Up by h units",
        "Down by h units"
      ]
    },
    {
      "q": "Which test checks whether a function is one-to-one?",
      "a": "Horizontal Line Test",
      "w": [
        "Vertical Line Test only",
        "Derivative Test",
        "Midpoint Test"
      ]
    },
    {
      "q": "To find an inverse, first write",
      "a": "y = f(x)",
      "w": [
        "x = 0",
        "f(x) = 0 in every case",
        "y = x²"
      ]
    },
    {
      "q": "The domain of an inverse function equals the original function’s",
      "a": "Range",
      "w": [
        "Domain in every case",
        "Codomain in every case",
        "Graph"
      ]
    }
  ]
});

window.EXAMS = window.EXAMS || {};
Object.assign(window.EXAMS, {
  "math-sheet-1": {
    "id": "math-sheet-1",
    "subject": "math",
    "title": {
      "en": "Exam 1 — Algebra Preliminaries",
      "ar": "امتحان 1 — أساسيات الجبر"
    },
    "format": "written-pdf",
    "kind": "written",
    "pdf": "data/Maths/exams/Exam1_Algebra_Preliminaries.pdf",
    "description": {
      "en": "Original worksheet: integer exponents, rational exponents, radicals, polynomials, factoring and rational expressions.",
      "ar": "الشيت الأصلي: الأسس الصحيحة والكسرية والجذور وكثيرات الحدود والتحليل والكسور الجبرية."
    },
    "questionCount": 78,
    "sections": [
      {
        "title": "1.1 Integer Exponents",
        "count": 9,
        "pages": "2"
      },
      {
        "title": "1.2 Rational Exponents",
        "count": 10,
        "pages": "3"
      },
      {
        "title": "1.3 Radicals",
        "count": 19,
        "pages": "4–5"
      },
      {
        "title": "1.4 Polynomials",
        "count": 10,
        "pages": "6"
      },
      {
        "title": "1.5 Factoring Polynomials",
        "count": 18,
        "pages": "7"
      },
      {
        "title": "1.6 Rational Expressions",
        "count": 12,
        "pages": "8"
      }
    ],
    "instructions": "Solve all problems in the attached original PDF. The original PDF contains 78 questions; expressions are preserved verbatim to avoid transcription errors in powers and radicals."
  },
  "math-sheet-2": {
    "id": "math-sheet-2",
    "subject": "math",
    "title": {
      "en": "Exam 2 — Equations and Linear Inequalities",
      "ar": "امتحان 2 — المعادلات والمتباينات الخطية"
    },
    "format": "written-pdf",
    "kind": "written",
    "pdf": "data/Maths/exams/Exam2_Equations_Inequalities.pdf",
    "description": {
      "en": "Solutions and solution sets, linear equations, and linear inequalities.",
      "ar": "تحديد إذا كانت القيمة حلًا، المعادلات الخطية، والمتباينات الخطية."
    },
    "questionCount": 20,
    "questions": [
      {
        "n": 1,
        "q": "Is x = 6 a solution to 2x − 5 = 3(1 − x) + 22?"
      },
      {
        "n": 2,
        "q": "Is t = 7 a solution to t² + 3t − 10 = 4 + 8t?"
      },
      {
        "n": 3,
        "q": "Is t = −3 a solution to t² + 3t − 10 = 4 + 8t?"
      },
      {
        "n": 4,
        "q": "Is w = −2 a solution to (w² + 8w + 12)/(w + 2) = 0?"
      },
      {
        "n": 5,
        "q": "Is z = 4 a solution to 6z − z² ≥ z² + 3?"
      },
      {
        "n": 6,
        "q": "Is y = 0 a solution to 2(y + 7) − 1 < 4(y + 1) + 3(4y + 10)?"
      },
      {
        "n": 7,
        "q": "Is x = 1 a solution to (x + 1)² > 3x + 1?"
      },
      {
        "n": 8,
        "q": "Solve and check: 4x − 7(2 − x) = 3x + 2."
      },
      {
        "n": 9,
        "q": "Solve and check: 2(w + 3) − 10 = 6(3² − 3w). Confirm the printed exponent against the PDF."
      },
      {
        "n": 10,
        "q": "Solve and check: (4 − 2z)/3 = 3/4 − 5z/6."
      },
      {
        "n": 11,
        "q": "Solve and check: 4t/(t² − 25) = 1/(5 − t)."
      },
      {
        "n": 12,
        "q": "Solve and check: (3y + 4)/(y − 1) = 2 + 7/(y − 1)."
      },
      {
        "n": 13,
        "q": "Solve and check: 5x/(3x − 3) + 6/(x + 2) = 5/3."
      },
      {
        "n": 14,
        "q": "Solve: 4(z + 2) − 1 > 5 − 7(4 − z)."
      },
      {
        "n": 15,
        "q": "Solve: (1/2)(3 + 4t) ≤ 6(1/3 − t/2) − (1/4)(2 + 10t)."
      },
      {
        "n": 16,
        "q": "Solve the compound inequality: −1 < 4x + 2 < 10."
      },
      {
        "n": 17,
        "q": "Solve the compound inequality: 8 ≤ 3 − 5z < 12."
      },
      {
        "n": 18,
        "q": "Solve the compound inequality: 0 ≤ 10w − 15 ≤ 23."
      },
      {
        "n": 19,
        "q": "Solve the compound inequality: 2 < 1/6 − x/2 ≤ 4."
      },
      {
        "n": 20,
        "q": "If 0 ≤ x < 3, determine a and b so that a ≤ 4x + 1 < b."
      }
    ],
    "instructions": "Write full steps and check answers. For rational equations, state excluded denominator values."
  },
  "math-sheet-3": {
    "id": "math-sheet-3",
    "subject": "math",
    "title": {
      "en": "Exam 3 — Quadratic and Absolute Inequalities",
      "ar": "امتحان 3 — المتباينات التربيعية والقيمة المطلقة"
    },
    "format": "written-pdf",
    "kind": "written",
    "pdf": "data/Maths/exams/Exam3_Quadratic_Absolute_Inequalities.pdf",
    "description": {
      "en": "32 quadratic inequalities and 21 absolute-value questions.",
      "ar": "٣٢ متباينة تربيعية و٢١ سؤالًا على القيمة المطلقة."
    },
    "questionCount": 53,
    "questions": [
      {
        "n": 1,
        "q": "Solve and represent the solution on a number line: x² − 1 < 0"
      },
      {
        "n": 2,
        "q": "Solve and represent the solution on a number line: −x² − 5x + 6 > 0"
      },
      {
        "n": 3,
        "q": "Solve and represent the solution on a number line: x² − 5x − 6 < 0"
      },
      {
        "n": 4,
        "q": "Solve and represent the solution on a number line: x² + 4x − 5 > 0"
      },
      {
        "n": 5,
        "q": "Solve and represent the solution on a number line: x² − 2x − 3 ≥ 0"
      },
      {
        "n": 6,
        "q": "Solve and represent the solution on a number line: x² > 5x + 6"
      },
      {
        "n": 7,
        "q": "Solve and represent the solution on a number line: −x² − 12x − 11 ≤ 0"
      },
      {
        "n": 8,
        "q": "Solve and represent the solution on a number line: x² − 2x − 8 ≥ 0"
      },
      {
        "n": 9,
        "q": "Solve and represent the solution on a number line: x² − 5x − 6 ≥ 0"
      },
      {
        "n": 10,
        "q": "Solve and represent the solution on a number line: x² + 7x + 10 < 0"
      },
      {
        "n": 11,
        "q": "Solve and represent the solution on a number line: x² + 9x + 20 > 0"
      },
      {
        "n": 12,
        "q": "Solve and represent the solution on a number line: x² − 8x + 16 > 0"
      },
      {
        "n": 13,
        "q": "Solve and represent the solution on a number line: x² − 8x + 12 ≤ 0"
      },
      {
        "n": 14,
        "q": "Solve and represent the solution on a number line: x² − 11x + 30 ≤ 0"
      },
      {
        "n": 15,
        "q": "Solve and represent the solution on a number line: x² − 12x + 27 ≥ 0"
      },
      {
        "n": 16,
        "q": "Solve and represent the solution on a number line: x² − 16x + 64 ≥ 0"
      },
      {
        "n": 17,
        "q": "Solve and represent the solution on a number line: x² − 36 ≤ 0"
      },
      {
        "n": 18,
        "q": "Solve and represent the solution on a number line: x² − 13x + 36 ≥ 0"
      },
      {
        "n": 19,
        "q": "Solve and represent the solution on a number line: x² + 15x + 36 ≤ 0"
      },
      {
        "n": 20,
        "q": "Solve and represent the solution on a number line: 4x² − 6x − 9 > x²"
      },
      {
        "n": 21,
        "q": "Solve and represent the solution on a number line: 5x² − 15x + 10 < 0"
      },
      {
        "n": 22,
        "q": "Solve and represent the solution on a number line: 3x² − 5x ≥ 4x² + 6"
      },
      {
        "n": 23,
        "q": "Solve and represent the solution on a number line: 4x² − 12 > 3x² + x"
      },
      {
        "n": 24,
        "q": "Solve and represent the solution on a number line: x² − 2x ≥ x² − 6x + 12"
      },
      {
        "n": 25,
        "q": "Solve and represent the solution on a number line: 2x² + 2x − 8 > x²"
      },
      {
        "n": 26,
        "q": "Solve and represent the solution on a number line: 4x² + 20x − 11 < 0"
      },
      {
        "n": 27,
        "q": "Solve and represent the solution on a number line: −9x² + 29x − 6 ≥ 0"
      },
      {
        "n": 28,
        "q": "Solve and represent the solution on a number line: −8x² + 6x − 1 ≤ 0"
      },
      {
        "n": 29,
        "q": "Solve and represent the solution on a number line: 12x² + 10x − 12 > 0"
      },
      {
        "n": 30,
        "q": "Solve and represent the solution on a number line: 18x² + 23x + 5 ≤ 0"
      },
      {
        "n": 31,
        "q": "Solve and represent the solution on a number line: 17x² + 15x − 2 ≥ 0"
      },
      {
        "n": 32,
        "q": "Solve and represent the solution on a number line: 3x² + 7x ≤ 5x² + 3x − 6"
      },
      {
        "n": 33,
        "q": "Solve: |x − 4| = 9"
      },
      {
        "n": 34,
        "q": "Solve: |3x + 6| = 15"
      },
      {
        "n": 35,
        "q": "Solve: 2|x + 5| − 3 = 11"
      },
      {
        "n": 36,
        "q": "Solve: |4x + 9| = −3"
      },
      {
        "n": 37,
        "q": "Solve: 3|x − 5| + 14 = 2"
      },
      {
        "n": 38,
        "q": "Solve: −2|7x − 1| = −10"
      },
      {
        "n": 39,
        "q": "Solve: |5x − 3| + 10 = 4"
      },
      {
        "n": 40,
        "q": "Solve: |2x − 5| = x + 1"
      },
      {
        "n": 41,
        "q": "Solve: |2x − 3| = −|x + 4|"
      },
      {
        "n": 42,
        "q": "Solve: |x + 3| ≤ 8"
      },
      {
        "n": 43,
        "q": "Solve: |2x − 5| > 7"
      },
      {
        "n": 44,
        "q": "Solve: |4x + 1| < 13"
      },
      {
        "n": 45,
        "q": "Solve: 3|x − 2| + 4 ≥ 19"
      },
      {
        "n": 46,
        "q": "Solve: −2|3x + 1| − 5 > −15"
      },
      {
        "n": 47,
        "q": "Solve: 5|2x − 7| + 12 ≤ 2"
      },
      {
        "n": 48,
        "q": "Solve: |3x + 1| < −5"
      },
      {
        "n": 49,
        "q": "Solve: |6x − 2| ≤ 0"
      },
      {
        "n": 50,
        "q": "Solve: −4|x + 8| − 7 ≥ 9"
      },
      {
        "n": 51,
        "q": "Solve: |2x + 5| > −4"
      },
      {
        "n": 52,
        "q": "Solve: |x − 7| + 9 ≥ 4"
      },
      {
        "n": 53,
        "q": "Solve: 2|4x + 3| + 1 < 15"
      }
    ],
    "instructions": "Solve each problem, show the sign chart where appropriate, and graph the solution on a number line for quadratic inequalities."
  }
});
