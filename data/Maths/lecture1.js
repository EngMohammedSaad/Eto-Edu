/* ==========================================================
   data/Maths/lecture1.js
   MAT 101 — أول 3 وحدات مُلخّصة بالعربي والإنجليزي
   IDs: math-1, math-2, math-3
   ========================================================== */
window.LECTURES = window.LECTURES || {};
Object.assign(window.LECTURES, {
  "math-1": {
    "id": "math-1",
    "subject": "math",
    "track": "science",
    "number": 1,
    "title": {
      "en": "Real Numbers & Algebra Basics",
      "ar": "الأعداد الحقيقية وأساسيات الجبر"
    },
    "description": {
      "en": "Number sets, intervals, exponents, algebraic identities, linear and quadratic equations.",
      "ar": "مجموعات الأعداد والفترات والأسس والمتطابقات الجبرية وحل المعادلات الخطية والتربيعية."
    },
    "cover": "math1",
    "sections": [
      {
        "id": "s1",
        "title": {
          "en": "Number Sets and the Real Line",
          "ar": "مجموعات الأعداد وخط الأعداد"
        },
        "figures": [],
        "points": [
          {
            "en": "Natural numbers N = {1, 2, 3, ...}; integers Z include negative numbers, zero and positive numbers.",
            "ar": "الأعداد الطبيعية N = {1,2,3,...}، والأعداد الصحيحة Z فيها السالب والصفر والموجب."
          },
          {
            "en": "Rational numbers Q can be written as p/q where p and q are integers and q ≠ 0. Irrational numbers cannot be written as such a fraction.",
            "ar": "العدد النسبي Q يتكتب p/q بحيث p وq صحيحين وq مش بصفر. غير النسبي ماينفعش يتكتب بالشكل ده، زي √2."
          },
          {
            "en": "The real numbers R include rational and irrational numbers, and each real number corresponds to one point on the real line.",
            "ar": "الأعداد الحقيقية R بتشمل النسبي وغير النسبي، وكل عدد حقيقي ليه نقطة على خط الأعداد."
          },
          {
            "en": "The course notes introduce complex numbers using i² = −1. This extends the real-number system.",
            "ar": "المذكرة بتقدم الأعداد المركبة بالرمز i بحيث i² = −1، وده توسّع لنظام الأعداد الحقيقية."
          }
        ],
        "examFocus": [
          {
            "en": "Know N, Z, Q and R and the distinction between rational and irrational numbers.",
            "ar": "احفظ معنى N وZ وQ وR والفرق بين النسبي وغير النسبي."
          },
          {
            "en": "Every real number is represented by a point on the real line.",
            "ar": "كل عدد حقيقي بيمثله نقطة على خط الأعداد."
          }
        ],
        "key": {
          "en": "Real numbers = rational ∪ irrational. The real line represents their order.",
          "ar": "الأعداد الحقيقية = نسبية وغير نسبية، وخط الأعداد بيوضح ترتيبها."
        }
      },
      {
        "id": "s2",
        "title": {
          "en": "Intervals and Inequality Symbols",
          "ar": "الفترات ورموز المتباينات"
        },
        "figures": [],
        "points": [
          {
            "en": "a < b means a is less than b; a ≤ b allows equality. Likewise, > means greater than and ≥ allows equality.",
            "ar": "a < b معناها a أصغر من b، وa ≤ b بتسمح بالمساواة. ونفس الفكرة مع > و≥."
          },
          {
            "en": "(a,b) or ]a,b[ is open; [a,b] is closed; [a,b) includes a but not b; (a,b] includes b but not a. The course PDF often writes open intervals as ]a,b[.",
            "ar": "الفترة المفتوحة ]a,b[ الطرفين مش داخلين، والمغلقة [a,b] الطرفين داخلين. وفي الفترة النصف مفتوحة طرف واحد بس داخل."
          },
          {
            "en": "Infinite intervals always use an open end at infinity: [a,∞), (−∞,b], etc. Infinity is not a real number.",
            "ar": "الفترة اللي فيها ∞ لازم طرفها عند اللانهاية يبقى مفتوح؛ لأن اللانهاية مش عدد حقيقي."
          },
          {
            "en": "On a number line, a filled dot means included and a hollow dot means excluded.",
            "ar": "على خط الأعداد، النقطة المصمتة معناها الطرف داخل في الحل، والفارغة معناها مش داخل."
          }
        ],
        "examFocus": [
          {
            "en": "Translate inequality symbols to interval notation and back.",
            "ar": "حوّل بين صيغة المتباينة وصيغة الفترة."
          },
          {
            "en": "Never close an interval at +∞ or −∞.",
            "ar": "ماتستخدمش قوس مغلق مع +∞ أو −∞."
          }
        ],
        "key": {
          "en": "Square bracket = included endpoint; round/open bracket = excluded endpoint.",
          "ar": "القوس المربع يعني الطرف داخل، والمفتوح/الدائري يعني الطرف خارج."
        }
      },
      {
        "id": "s3",
        "title": {
          "en": "Exponent Rules and Radicals",
          "ar": "قوانين الأسس والجذور"
        },
        "figures": [],
        "points": [
          {
            "en": "For a ≠ 0: aᵐaⁿ = aᵐ⁺ⁿ; aᵐ/aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ.",
            "ar": "لما الأساس واحد: في الضرب بنجمع الأسس، وفي القسمة بنطرحها، وفي قوة القوة بنضرب الأسس."
          },
          {
            "en": "(ab)ⁿ = aⁿbⁿ and (a/b)ⁿ = aⁿ/bⁿ when the expression is defined.",
            "ar": "قوة حاصل الضرب بتتوزع على العاملين، وقوة الكسر بتتوزع على البسط والمقام مع مراعاة إن المقام مايساويش صفر."
          },
          {
            "en": "a⁰ = 1 for a ≠ 0, and a⁻ⁿ = 1/aⁿ. Rewrite negative exponents so the final answer has positive exponents when asked.",
            "ar": "a⁰ = 1 لو a مش بصفر، وa⁻ⁿ = 1/aⁿ. لو مطلوب أسس موجبة، انقل العامل بين البسط والمقام."
          },
          {
            "en": "A rational exponent represents a root: a^(1/n) = ⁿ√a; a^(m/n) = ⁿ√(aᵐ), subject to the domain of the root.",
            "ar": "الأس الكسري بيمثل جذر: a^(1/n) = الجذر النوني لـa، والأس m/n معناه الجذر النوني للقوة m مع مراعاة المجال."
          },
          {
            "en": "Simplify radicals by taking out perfect powers. When rationalizing a denominator, multiply by a suitable factor so the denominator becomes rational.",
            "ar": "بسّط الجذور بإخراج القوى الكاملة، وعند ترشيد المقام اضرب في عامل مناسب يخلي المقام من غير جذر."
          }
        ],
        "examFocus": [
          {
            "en": "Apply exponent laws carefully and state domain restrictions where needed.",
            "ar": "طبّق قوانين الأسس بدقة وحدد قيود المجال عند الحاجة."
          },
          {
            "en": "Do not confuse a⁻ⁿ with −aⁿ.",
            "ar": "خلي بالك: a⁻ⁿ مش معناها −aⁿ."
          }
        ],
        "key": {
          "en": "Simplify first, then make sure the final form meets the instruction (for example, positive exponents only).",
          "ar": "بسّط الأول، وبعدها اتأكد إن الناتج ملتزم بالمطلوب، زي إن الأسس تكون موجبة."
        }
      },
      {
        "id": "s4",
        "title": {
          "en": "Algebraic Identities, Polynomials and Factoring",
          "ar": "المتطابقات وكثيرات الحدود والتحليل"
        },
        "figures": [],
        "points": [
          {
            "en": "(a+b)² = a² + 2ab + b² and (a−b)² = a² − 2ab + b².",
            "ar": "مربع مجموع حدين = مربع الأول + ضعف حاصل ضربهما + مربع الثاني، ومربع الفرق بنفس الفكرة مع إشارة سالبة في الحد الأوسط."
          },
          {
            "en": "a²−b² = (a−b)(a+b). Also, (x+a)(x+b) = x² +(a+b)x + ab.",
            "ar": "فرق مربعين بيتحلل إلى (a−b)(a+b)، وضرب (x+a)(x+b) ينتج x² +(a+b)x + ab."
          },
          {
            "en": "A polynomial is a sum of terms with nonnegative integer powers of the variable. Its degree is the largest power with a nonzero coefficient after simplifying.",
            "ar": "كثيرة الحدود مجموع حدود أسس المتغير فيها أعداد صحيحة غير سالبة، ودرجتها أكبر أس بعد التبسيط."
          },
          {
            "en": "Common factoring methods in the sheets: greatest common factor, grouping, trinomial factoring, and difference of squares.",
            "ar": "طرق التحليل الموجودة في الشيتات: العامل المشترك الأكبر، التجميع، تحليل ثلاثي الحدود، وفرق مربعين."
          },
          {
            "en": "Important caution: (a+b)² is not equal to a²+b² in general; the middle term 2ab is required.",
            "ar": "مهم: (a+b)² مش بتساوي a²+b² عمومًا؛ لازم الحد الأوسط 2ab."
          }
        ],
        "examFocus": [
          {
            "en": "Identify the degree after carrying out the operation and collecting like terms.",
            "ar": "حدد الدرجة بعد إجراء العملية وتجميع الحدود المتشابهة."
          },
          {
            "en": "Check a factorization by expanding it back.",
            "ar": "راجع التحليل بضرب العوامل في بعض تاني."
          }
        ],
        "key": {
          "en": "Expand to simplify; factor to express a polynomial as a product. Do not omit middle terms.",
          "ar": "النشر بيحوّل الضرب لجمع، والتحليل بيحوّل كثيرة الحدود لحاصل ضرب عوامل. ماتنساش الحد الأوسط."
        }
      },
      {
        "id": "s5",
        "title": {
          "en": "Linear Equations and Rational Expressions",
          "ar": "المعادلات الخطية والكسور الجبرية"
        },
        "figures": [],
        "points": [
          {
            "en": "A linear equation in one unknown can be written ax+b=0, with a ≠ 0; its solution is x=−b/a.",
            "ar": "المعادلة الخطية في مجهول واحد صورتها ax+b=0 بشرط a مش بصفر، وحلها x=−b/a."
          },
          {
            "en": "Apply the same operation to both sides of an equation. Collect variable terms on one side and constants on the other, then solve.",
            "ar": "اعمل نفس العملية في الطرفين، واجمع حدود المتغير في طرف والثوابت في الطرف التاني، وبعدها حل."
          },
          {
            "en": "For equations with denominators, first note where the original denominator is zero; those values are excluded even if later algebra seems to allow them.",
            "ar": "في المعادلات اللي فيها مقامات، سجل الأول القيم اللي بتصفر المقام؛ القيم دي ممنوعة حتى لو اختفت بعد الاختصار."
          },
          {
            "en": "A rational expression is a quotient of polynomials. Factor numerator and denominator and cancel only common factors, not separate terms.",
            "ar": "الكسر الجبري هو نسبة كثيرتي حدود. حلل البسط والمقام واختصر العوامل المشتركة فقط، مش الحدود المنفصلة."
          },
          {
            "en": "Check a proposed solution in the original equation, especially when denominators or squaring were involved.",
            "ar": "عوّض بالحل في المعادلة الأصلية، خصوصًا لو فيها مقامات أو تم تربيع الطرفين."
          }
        ],
        "examFocus": [
          {
            "en": "Remember excluded values from denominators.",
            "ar": "افتكر القيم الممنوعة من المقام."
          },
          {
            "en": "Check the final solution in the original equation.",
            "ar": "راجع الحل بالتعويض في المعادلة الأصلية."
          }
        ],
        "key": {
          "en": "Keep the original domain restrictions throughout the algebra.",
          "ar": "حافظ على قيود المجال الأصلية طول خطوات الحل."
        }
      },
      {
        "id": "s6",
        "title": {
          "en": "Quadratic Equations",
          "ar": "المعادلات التربيعية"
        },
        "figures": [],
        "points": [
          {
            "en": "A quadratic equation has form ax²+bx+c=0 with a ≠ 0.",
            "ar": "المعادلة التربيعية صورتها ax²+bx+c=0 بشرط a مش بصفر."
          },
          {
            "en": "Factorization method: if (x−α)(x−β)=0, then x=α or x=β.",
            "ar": "طريقة التحليل: لو (x−α)(x−β)=0، يبقى x=α أو x=β."
          },
          {
            "en": "Quadratic formula: x = (−b ± √(b²−4ac))/(2a).",
            "ar": "القانون العام: x = (−b ± √(b²−4ac))/(2a)."
          },
          {
            "en": "The discriminant Δ=b²−4ac determines the real roots: Δ>0 two distinct real roots; Δ=0 one repeated real root; Δ<0 no real roots.",
            "ar": "المميز Δ=b²−4ac بيحدد الجذور الحقيقية: موجب جذران مختلفان، صفر جذر مكرر، سالب مفيش جذور حقيقية."
          },
          {
            "en": "Completing the square is another method mentioned in the course notes. Choose the method that makes the algebra simplest.",
            "ar": "إكمال المربع طريقة تالتة مذكورة في المذكرة. اختار الطريقة اللي تسهّل الحساب."
          }
        ],
        "examFocus": [
          {
            "en": "Know the three methods: factoring, quadratic formula, completing the square.",
            "ar": "احفظ الطرق الثلاث: التحليل، القانون العام، وإكمال المربع."
          },
          {
            "en": "Use the discriminant to determine the number of real roots.",
            "ar": "استخدم المميز لتحديد عدد الجذور الحقيقية."
          }
        ],
        "key": {
          "en": "For ax²+bx+c=0, calculate Δ=b²−4ac before classifying the roots.",
          "ar": "في المعادلة التربيعية احسب المميز الأول قبل ما تحدد نوع الجذور."
        }
      }
    ],
    "glossary": [
      [
        "real number",
        "عدد حقيقي"
      ],
      [
        "natural number",
        "عدد طبيعي"
      ],
      [
        "integer",
        "عدد صحيح"
      ],
      [
        "rational number",
        "عدد نسبي"
      ],
      [
        "irrational number",
        "عدد غير نسبي"
      ],
      [
        "complex number",
        "عدد مركب"
      ],
      [
        "number line",
        "خط الأعداد"
      ],
      [
        "interval",
        "فترة"
      ],
      [
        "open interval",
        "فترة مفتوحة"
      ],
      [
        "closed interval",
        "فترة مغلقة"
      ],
      [
        "inequality",
        "متباينة"
      ],
      [
        "exponent",
        "أس"
      ],
      [
        "power",
        "قوة"
      ],
      [
        "negative exponent",
        "أس سالب"
      ],
      [
        "rational exponent",
        "أس كسري"
      ],
      [
        "radical",
        "جذر"
      ],
      [
        "rationalize the denominator",
        "ترشيد المقام"
      ],
      [
        "algebraic identity",
        "متطابقة جبرية"
      ],
      [
        "polynomial",
        "كثيرة حدود"
      ],
      [
        "degree",
        "درجة كثيرة الحدود"
      ],
      [
        "factor",
        "عامل"
      ],
      [
        "factoring",
        "تحليل"
      ],
      [
        "greatest common factor",
        "العامل المشترك الأكبر"
      ],
      [
        "grouping",
        "التجميع"
      ],
      [
        "rational expression",
        "كسر جبري"
      ],
      [
        "linear equation",
        "معادلة خطية"
      ],
      [
        "quadratic equation",
        "معادلة تربيعية"
      ],
      [
        "quadratic formula",
        "القانون العام"
      ],
      [
        "discriminant",
        "المميز"
      ],
      [
        "double root",
        "جذر مكرر"
      ],
      [
        "complete the square",
        "إكمال المربع"
      ]
    ],
    "images": {
      "math1": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iNTQwIiB2aWV3Qm94PSIwIDAgOTYwIDU0MCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iIzdjM2FlZCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzMxMmU4MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI5NjAiIGhlaWdodD0iNTQwIiByeD0iMzYiIGZpbGw9InVybCgjZykiLz48ZyBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iLjEyIj48Y2lyY2xlIGN4PSI4MDAiIGN5PSI4MCIgcj0iMTUwIi8+PGNpcmNsZSBjeD0iMTEwIiBjeT0iNTAwIiByPSIyMTAiLz48L2c+PHRleHQgeD0iNzIiIHk9IjE5MCIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDIiIGZpbGw9IiNlOWU3ZmYiPk1BVCAxMDEg4oCiIE1BVEhFTUFUSUNTIEk8L3RleHQ+PHRleHQgeD0iNzIiIHk9IjI4NSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNjYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IndoaXRlIj5SRUFMIE5VTUJFUlMgJiBBTEdFQlJBPC90ZXh0Pjx0ZXh0IHg9Ijc2IiB5PSIzNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmaWxsPSIjZjJlZGZmIj5JbnRlcnZhbHMg4oCiIEV4cG9uZW50cyDigKIgRXF1YXRpb25zPC90ZXh0Pjx0ZXh0IHg9Ijc3MCIgeT0iNDc1IiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSI2MCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9Ii44NSI+4oiRICDiiKsgIOKImng8L3RleHQ+PC9zdmc+"
    }
  },
  "math-2": {
    "id": "math-2",
    "subject": "math",
    "track": "science",
    "number": 2,
    "title": {
      "en": "Inequalities",
      "ar": "المتباينات"
    },
    "description": {
      "en": "Linear, compound, quadratic and absolute-value inequalities with interval notation.",
      "ar": "المتباينات الخطية والمركبة والتربيعية ومتباينات القيمة المطلقة وكتابة الحل بالفترات."
    },
    "cover": "math2",
    "sections": [
      {
        "id": "s1",
        "title": {
          "en": "Basic Inequalities and Their Properties",
          "ar": "المتباينات وخواصها الأساسية"
        },
        "figures": [],
        "points": [
          {
            "en": "An inequality compares expressions using <, >, ≤, ≥ or ≠.",
            "ar": "المتباينة بتقارن بين تعبيرات باستخدام < أو > أو ≤ أو ≥ أو ≠."
          },
          {
            "en": "Adding or subtracting the same real number on both sides preserves the inequality sign. Multiplying or dividing by a positive number also preserves it.",
            "ar": "إضافة أو طرح نفس العدد من الطرفين ما بيغيرش اتجاه الإشارة، والضرب أو القسمة في عدد موجب كمان ما بيغيروش."
          },
          {
            "en": "Multiplying or dividing both sides by a negative number reverses the inequality sign. This is the most important step to remember.",
            "ar": "الضرب أو القسمة في عدد سالب بيقلب اتجاه علامة المتباينة، ودي أهم قاعدة."
          },
          {
            "en": "Solve by simplifying, moving variable terms together, isolating the variable, and then writing the solution in inequality and interval notation.",
            "ar": "حل المتباينة بالتبسيط، وتجميع حدود المتغير، وعزل المتغير، وبعدها اكتب الحل بصيغة متباينة وفترة."
          }
        ],
        "examFocus": [
          {
            "en": "Reverse the sign only when multiplying or dividing by a negative number.",
            "ar": "اقلب العلامة لما تضرب أو تقسم في عدد سالب."
          },
          {
            "en": "Give both inequality notation and interval notation when requested.",
            "ar": "اكتب صيغة المتباينة والفترة لو السؤال طلب الاتنين."
          }
        ],
        "key": {
          "en": "If you divide by a negative number, reverse the inequality sign.",
          "ar": "لو قسمت على عدد سالب، اقلب اتجاه العلامة."
        }
      },
      {
        "id": "s2",
        "title": {
          "en": "Compound Inequalities",
          "ar": "المتباينات المركبة"
        },
        "figures": [],
        "points": [
          {
            "en": "For “and”, a value must satisfy both inequalities; take the intersection of the two solution sets.",
            "ar": "في AND أو «و»، القيمة لازم تحقق المتباينتين؛ بناخد الجزء المشترك بين الحلين."
          },
          {
            "en": "For “or”, a value may satisfy either inequality; take the union of the solution sets.",
            "ar": "في OR أو «أو»، يكفي تحقق واحدة؛ بناخد اتحاد مجموعتي الحل."
          },
          {
            "en": "For a chained inequality such as a < bx+c < d, perform equivalent operations on all three parts; if dividing by a negative number, reverse both inequality signs.",
            "ar": "في متباينة متسلسلة زي a < bx+c < d، طبّق العمليات المكافئة على الأجزاء الثلاثة، ولو قسمت على سالب اقلب العلامتين."
          },
          {
            "en": "If the intersection of inequalities is empty, the system has no solution (∅).",
            "ar": "لو مفيش أي قيمة مشتركة بين الحلين، مجموعة الحل فارغة ∅."
          }
        ],
        "examFocus": [
          {
            "en": "“And” means intersection; “or” means union.",
            "ar": "AND معناها تقاطع، وOR معناها اتحاد."
          },
          {
            "en": "Use the same sign-reversal rule in chained inequalities.",
            "ar": "قاعدة قلب الإشارة تنطبق كمان على المتباينة المتسلسلة."
          }
        ],
        "key": {
          "en": "Solve each part, then intersect for AND or combine for OR.",
          "ar": "حل كل جزء، وبعدها خُد التقاطع مع AND أو الاتحاد مع OR."
        }
      },
      {
        "id": "s3",
        "title": {
          "en": "Quadratic and Nonlinear Inequalities",
          "ar": "المتباينات التربيعية وغير الخطية"
        },
        "figures": [],
        "points": [
          {
            "en": "For a product P(x)Q(x)>0, the two factors must have the same sign; for P(x)Q(x)<0, they must have opposite signs.",
            "ar": "لو حاصل ضرب عاملين موجب، إشارتهم واحدة؛ ولو سالب، إشارتهم مختلفة."
          },
          {
            "en": "Find all real zeros of the expression and all values where it is undefined. These points split the number line into open intervals.",
            "ar": "هات جذور التعبير وكل القيم اللي التعبير عندها غير معرّف. القيم دي بتقسّم خط الأعداد لفترات مفتوحة."
          },
          {
            "en": "Choose a test value in each interval and determine the sign. The sign remains constant inside each interval unless a zero or undefined point is crossed.",
            "ar": "اختار قيمة اختبار من كل فترة وحدد الإشارة؛ الإشارة بتفضل ثابتة جوه الفترة لحد ما تعدّي جذر أو نقطة عدم تعريف."
          },
          {
            "en": "For ax²+bx+c, first find the roots or determine whether real roots exist. For a parabola opening upward, the expression is positive outside two distinct roots and negative between them.",
            "ar": "في ax²+bx+c هات الجذور أو اعرف هل فيه جذور حقيقية. لو القطع المكافئ مفتوح لفوق وله جذرين، التعبير موجب بره الجذرين وسالب بينهم."
          },
          {
            "en": "Whether the endpoints are included depends on ≤ or ≥; for a rational expression, points where the denominator is zero are always excluded.",
            "ar": "دخول الجذور في الحل بيتحدد بعلامة ≤ أو ≥، لكن القيم اللي بتصفر المقام مستبعدة دائمًا."
          }
        ],
        "examFocus": [
          {
            "en": "Mark every zero and excluded value before making the sign chart.",
            "ar": "علّم كل الجذور والقيم الممنوعة قبل جدول الإشارات."
          },
          {
            "en": "Check whether the inequality is strict (< or >) or includes equality (≤ or ≥).",
            "ar": "راجع هل العلامة صارمة < أو > ولا بتسمح بالمساواة."
          }
        ],
        "key": {
          "en": "Critical points divide the number line; test one point from each interval.",
          "ar": "النقط الحرجة بتقسم خط الأعداد؛ اختبر قيمة من كل فترة."
        }
      },
      {
        "id": "s4",
        "title": {
          "en": "Absolute Value Equations and Inequalities",
          "ar": "معادلات ومتباينات القيمة المطلقة"
        },
        "figures": [],
        "points": [
          {
            "en": "|x| is the distance of x from zero, so it is always nonnegative. More generally |x−a| is the distance between x and a.",
            "ar": "|x| هي بُعد x عن الصفر، فدايمًا غير سالبة. و|x−a| هي المسافة بين x وa."
          },
          {
            "en": "If |A|=c and c>0, then A=c or A=−c. If c<0, |A|=c has no solution. If c=0, then A=0.",
            "ar": "لو |A|=c وc موجب، يبقى A=c أو A=−c. لو c سالب مفيش حل، ولو صفر يبقى A=0."
          },
          {
            "en": "For |A|<c with c>0, write −c<A<c. For |A|>c with c≥0, split into A<−c or A>c.",
            "ar": "لو |A|<c وc موجب، اكتب −c<A<c. ولو |A|>c، اقسم لحالتين A<−c أو A>c."
          },
          {
            "en": "Isolate the absolute value first. Be careful when multiplying an inequality by a negative coefficient, because the sign reverses.",
            "ar": "اعزل القيمة المطلقة الأول. وخلي بالك إن ضرب المتباينة في معامل سالب بيقلب العلامة."
          }
        ],
        "examFocus": [
          {
            "en": "An absolute value cannot be negative.",
            "ar": "القيمة المطلقة عمرها ما بتكون سالبة."
          },
          {
            "en": "Turn an absolute-value inequality into one or two ordinary inequalities.",
            "ar": "حوّل متباينة القيمة المطلقة لمتباينة عادية أو حالتين."
          }
        ],
        "key": {
          "en": "Absolute value is distance; its output is never negative.",
          "ar": "القيمة المطلقة معناها مسافة، ونتيجتها مش سالبة."
        }
      }
    ],
    "glossary": [
      [
        "inequality",
        "متباينة"
      ],
      [
        "solution set",
        "مجموعة الحل"
      ],
      [
        "number line",
        "خط الأعداد"
      ],
      [
        "endpoint",
        "طرف الفترة"
      ],
      [
        "filled dot",
        "نقطة مصمتة"
      ],
      [
        "hollow dot",
        "نقطة فارغة"
      ],
      [
        "compound inequality",
        "متباينة مركبة"
      ],
      [
        "intersection",
        "تقاطع"
      ],
      [
        "union",
        "اتحاد"
      ],
      [
        "test value",
        "قيمة اختبار"
      ],
      [
        "sign chart",
        "جدول الإشارات"
      ],
      [
        "critical point",
        "نقطة حرجة"
      ],
      [
        "zero of a function",
        "جذر التعبير"
      ],
      [
        "undefined",
        "غير معرّف"
      ],
      [
        "quadratic inequality",
        "متباينة تربيعية"
      ],
      [
        "parabola",
        "قطع مكافئ"
      ],
      [
        "absolute value",
        "قيمة مطلقة"
      ],
      [
        "strict inequality",
        "متباينة صارمة"
      ],
      [
        "rational expression",
        "كسر جبري"
      ],
      [
        "no solution",
        "لا يوجد حل"
      ]
    ],
    "images": {
      "math2": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iNTQwIiB2aWV3Qm94PSIwIDAgOTYwIDU0MCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iIzBmNzY2ZSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzE2NGU2MyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI5NjAiIGhlaWdodD0iNTQwIiByeD0iMzYiIGZpbGw9InVybCgjZykiLz48ZyBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iLjEyIj48Y2lyY2xlIGN4PSI4MDAiIGN5PSI4MCIgcj0iMTUwIi8+PGNpcmNsZSBjeD0iMTEwIiBjeT0iNTAwIiByPSIyMTAiLz48L2c+PHRleHQgeD0iNzIiIHk9IjE5MCIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDIiIGZpbGw9IiNlOWU3ZmYiPk1BVCAxMDEg4oCiIE1BVEhFTUFUSUNTIEk8L3RleHQ+PHRleHQgeD0iNzIiIHk9IjI4NSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNjYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IndoaXRlIj5JTkVRVUFMSVRJRVM8L3RleHQ+PHRleHQgeD0iNzYiIHk9IjM2MCIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IiNmMmVkZmYiPkxpbmVhciDigKIgQ29tcG91bmQg4oCiIFF1YWRyYXRpYyDigKIgQWJzb2x1dGUgVmFsdWU8L3RleHQ+PHRleHQgeD0iNzcwIiB5PSI0NzUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjYwIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iLjg1Ij7iiJEgIOKIqyAg4oiaeDwvdGV4dD48L3N2Zz4="
    }
  },
  "math-3": {
    "id": "math-3",
    "subject": "math",
    "track": "science",
    "number": 3,
    "title": {
      "en": "Functions and Function Notation",
      "ar": "الدوال وطريقة كتابتها"
    },
    "description": {
      "en": "Function rules, domain/codomain/range, graphs, elementary functions, transformations and inverses.",
      "ar": "قاعدة الدالة والمجال والمجال المقابل والمدى والرسوم والدوال الأساسية والتحويلات والدوال العكسية."
    },
    "cover": "math3",
    "sections": [
      {
        "id": "s1",
        "title": {
          "en": "What Is a Function?",
          "ar": "يعني إيه دالة؟"
        },
        "figures": [],
        "points": [
          {
            "en": "A function assigns an output to every allowed input, and each input must determine exactly one output.",
            "ar": "الدالة بتربط كل مدخل مسموح بمخرج واحد فقط؛ المدخل الواحد ماينفعش يطلع له مخرجين مختلفين."
          },
          {
            "en": "The input is the independent variable, often x; the output is the dependent variable, often y=f(x).",
            "ar": "المدخل هو المتغير المستقل وغالبًا x، والمخرج هو المتغير التابع وغالبًا y=f(x)."
          },
          {
            "en": "A relation may fail to be a function if one input is paired with more than one output.",
            "ar": "العلاقة ممكن ماتكونش دالة لو نفس المدخل مرتبط بأكتر من مخرج."
          },
          {
            "en": "A one-to-one (injective) function also maps distinct inputs to distinct outputs.",
            "ar": "الدالة واحد لواحد (Injective) بتدي مخرجات مختلفة للمدخلات المختلفة."
          }
        ],
        "examFocus": [
          {
            "en": "Each input has exactly one output.",
            "ar": "كل مدخل له مخرج واحد بالضبط."
          },
          {
            "en": "One-to-one is a stronger condition than simply being a function.",
            "ar": "واحد لواحد شرط زيادة على مجرد كون العلاقة دالة."
          }
        ],
        "key": {
          "en": "Function: one input cannot produce two different outputs.",
          "ar": "الدالة: نفس المدخل ماينفعش ينتج مخرجين مختلفين."
        }
      },
      {
        "id": "s2",
        "title": {
          "en": "Domain, Codomain, Range and Coordinates",
          "ar": "المجال والمجال المقابل والمدى والإحداثيات"
        },
        "figures": [],
        "points": [
          {
            "en": "For f:A→B, A is the domain and B is the codomain. The range is the set of actual outputs f(x), and is a subset of the codomain.",
            "ar": "في f:A→B، المجموعة A هي المجال وB هي المجال المقابل. المدى هو المخرجات الفعلية f(x)، وبيكون جزء من المجال المقابل."
          },
          {
            "en": "The graph of a function is the set of ordered pairs (x,f(x)) for allowed x-values.",
            "ar": "الرسم البياني للدالة هو مجموعة النقط (x,f(x)) لكل قيم x المسموحة."
          },
          {
            "en": "A point (x,y) has horizontal coordinate x and vertical coordinate y. Quadrants are numbered I in the upper-right, II upper-left, III lower-left and IV lower-right.",
            "ar": "النقطة (x,y): الإحداثي x أفقي وy رأسي. الأرباع: الأول فوق يمين، الثاني فوق شمال، الثالث تحت شمال، والرابع تحت يمين."
          },
          {
            "en": "The domain may be restricted by denominators that cannot be zero or by roots/logarithms whose inputs must satisfy their definitions.",
            "ar": "المجال ممكن يتقيّد بمقام لا يساوي صفر، أو بجذر/لوغاريتم لازم مدخله يحقق شروط التعريف."
          }
        ],
        "examFocus": [
          {
            "en": "Do not confuse codomain with range: the range contains only outputs actually attained.",
            "ar": "ماتخلطش المجال المقابل بالمدى؛ المدى فيه المخرجات اللي بتحصل فعلًا."
          },
          {
            "en": "Write ordered pairs in the order (x,y).",
            "ar": "اكتب الإحداثيات بالترتيب (x,y)."
          }
        ],
        "key": {
          "en": "Domain = allowed inputs; range = actual outputs.",
          "ar": "المجال = المدخلات المسموحة، والمدى = المخرجات الفعلية."
        }
      },
      {
        "id": "s3",
        "title": {
          "en": "Basic and Power Functions",
          "ar": "الدوال الأساسية ودوال القوى"
        },
        "figures": [],
        "points": [
          {
            "en": "A constant function f(x)=C has a horizontal graph y=C. The identity function is f(x)=x.",
            "ar": "الدالة الثابتة f(x)=C رسمها خط أفقي y=C، ودالة الهوية f(x)=x."
          },
          {
            "en": "Linear functions such as f(x)=mx+c have straight-line graphs. The slope m controls inclination and c is the vertical intercept.",
            "ar": "الدالة الخطية زي f(x)=mx+c رسمها خط مستقيم؛ m بيحدد الميل وc نقطة تقاطع الخط مع محور y."
          },
          {
            "en": "A power function has form f(x)=xⁿ. Positive integer powers such as x² and x³ have different graph shapes.",
            "ar": "دالة القوى صورتها f(x)=xⁿ. القوى الصحيحة الموجبة زي x² وx³ ليها أشكال مختلفة."
          },
          {
            "en": "For f(x)=1/x or 1/x², x=0 is excluded from the domain. The range of 1/x excludes 0, while 1/x² is positive.",
            "ar": "في 1/x و1/x²، القيمة x=0 ممنوعة من المجال. مدى 1/x يستبعد الصفر، و1/x² بيكون موجب."
          },
          {
            "en": "For the square-root function f(x)=√x over the real numbers, x≥0 and outputs are nonnegative.",
            "ar": "في الدالة √x على الأعداد الحقيقية، لازم x≥0 والمخرجات غير سالبة."
          }
        ],
        "examFocus": [
          {
            "en": "Know the domain restrictions of reciprocal and square-root functions.",
            "ar": "احفظ قيود المجال للدوال الكسرية والجذرية."
          },
          {
            "en": "Recognize constant, identity, linear and power-function graphs.",
            "ar": "ميّز رسم الدالة الثابتة والهوية والخطية ودالة القوى."
          }
        ],
        "key": {
          "en": "Check the rule and the domain before sketching a function.",
          "ar": "راجع قاعدة الدالة ومجالها قبل رسمها."
        }
      },
      {
        "id": "s4",
        "title": {
          "en": "Reflections and Graph Shifts",
          "ar": "انعكاس الرسوم وتحريكها"
        },
        "figures": [],
        "points": [
          {
            "en": "The graph of −f(x) is the reflection of f(x) across the x-axis.",
            "ar": "رسم −f(x) هو انعكاس رسم f(x) حول محور x."
          },
          {
            "en": "The graph of f(−x) is the reflection of f(x) across the y-axis.",
            "ar": "رسم f(−x) هو انعكاس رسم f(x) حول محور y."
          },
          {
            "en": "f(x)+c shifts the graph up by c units when c>0 and down by |c| units when c<0.",
            "ar": "f(x)+c بتحرك الرسم لفوق c وحدات لو c موجب، ولتحت |c| لو c سالب."
          },
          {
            "en": "f(x−h) shifts the graph right by h units when h>0; replacing x by x+h shifts it left.",
            "ar": "f(x−h) بتحرك الرسم لليمين h وحدات لما h موجب؛ وf(x+h) بتحركه للشمال h وحدات."
          }
        ],
        "examFocus": [
          {
            "en": "Outside the function changes vertical position; changing x inside the function changes horizontal position in the opposite direction.",
            "ar": "الإضافة خارج الدالة تغيّر الارتفاع، والتغيير داخل x بيحرّك الرسم أفقيًا في الاتجاه العكسي."
          },
          {
            "en": "Distinguish −f(x) from f(−x).",
            "ar": "فرّق بين −f(x) وf(−x)."
          }
        ],
        "key": {
          "en": "Outside changes are vertical; inside changes are horizontal and reversed.",
          "ar": "التغيير بره الدالة رأسي، واللي جوه x أفقي وبالاتجاه العكسي."
        }
      },
      {
        "id": "s5",
        "title": {
          "en": "Injective Functions and Inverses",
          "ar": "الدوال واحد لواحد والدوال العكسية"
        },
        "figures": [],
        "points": [
          {
            "en": "A function is injective if different domain values have different outputs. To disprove injectivity, one pair x₁≠x₂ with f(x₁)=f(x₂) is enough.",
            "ar": "الدالة واحد لواحد لو المدخلات المختلفة بتدي مخرجات مختلفة. لإثبات إنها مش واحد لواحد يكفي مثال x₁≠x₂ لكن f(x₁)=f(x₂)."
          },
          {
            "en": "Horizontal Line Test: a graph is injective exactly when every horizontal line intersects it at most once.",
            "ar": "اختبار الخط الأفقي: الدالة واحد لواحد لو كل خط أفقي بيقطع الرسم في نقطة واحدة على الأكثر."
          },
          {
            "en": "For an injective function, the inverse reverses input and output: f⁻¹(y)=x exactly when f(x)=y.",
            "ar": "الدالة العكسية بتبدّل المدخل بالمخرج: f⁻¹(y)=x لما f(x)=y."
          },
          {
            "en": "Steps from the notes: write y=f(x), solve for x in terms of y, then interchange x and y. The domain of the inverse is the range of the original function.",
            "ar": "الخطوات: اكتب y=f(x)، حلّ بالنسبة لـx، وبعدها بدّل x وy. مجال الدالة العكسية هو مدى الدالة الأصلية."
          }
        ],
        "examFocus": [
          {
            "en": "The inverse is a function only when the original function is one-to-one on its domain.",
            "ar": "الدالة العكسية بتكون دالة لما الأصلية تكون واحد لواحد على مجالها."
          },
          {
            "en": "Remember the horizontal-line test and the inverse steps.",
            "ar": "احفظ اختبار الخط الأفقي وخطوات إيجاد العكسية."
          }
        ],
        "key": {
          "en": "To find an inverse, solve y=f(x) for x, then swap the variable names.",
          "ar": "عشان تجيب العكسية، حل y=f(x) بالنسبة لـx وبعدها بدّل أسماء المتغيرات."
        }
      }
    ],
    "glossary": [
      [
        "function",
        "دالة"
      ],
      [
        "input",
        "مدخل"
      ],
      [
        "output",
        "مخرج"
      ],
      [
        "independent variable",
        "متغير مستقل"
      ],
      [
        "dependent variable",
        "متغير تابع"
      ],
      [
        "one-to-one",
        "واحد لواحد"
      ],
      [
        "injective",
        "دالة متباينة/واحد لواحد"
      ],
      [
        "domain",
        "المجال"
      ],
      [
        "codomain",
        "المجال المقابل"
      ],
      [
        "range",
        "المدى"
      ],
      [
        "ordered pair",
        "زوج مرتب"
      ],
      [
        "coordinate",
        "إحداثي"
      ],
      [
        "graph",
        "رسم بياني"
      ],
      [
        "constant function",
        "دالة ثابتة"
      ],
      [
        "identity function",
        "دالة الهوية"
      ],
      [
        "linear function",
        "دالة خطية"
      ],
      [
        "power function",
        "دالة قوى"
      ],
      [
        "reflection",
        "انعكاس"
      ],
      [
        "vertical shift",
        "إزاحة رأسية"
      ],
      [
        "horizontal shift",
        "إزاحة أفقية"
      ],
      [
        "horizontal line test",
        "اختبار الخط الأفقي"
      ],
      [
        "inverse function",
        "دالة عكسية"
      ],
      [
        "square-root function",
        "دالة الجذر التربيعي"
      ],
      [
        "piecewise-defined function",
        "دالة معرفة على أجزاء"
      ]
    ],
    "images": {
      "math3": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iNTQwIiB2aWV3Qm94PSIwIDAgOTYwIDU0MCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iIzFkNGVkOCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzMxMmU4MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI5NjAiIGhlaWdodD0iNTQwIiByeD0iMzYiIGZpbGw9InVybCgjZykiLz48ZyBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iLjEyIj48Y2lyY2xlIGN4PSI4MDAiIGN5PSI4MCIgcj0iMTUwIi8+PGNpcmNsZSBjeD0iMTEwIiBjeT0iNTAwIiByPSIyMTAiLz48L2c+PHRleHQgeD0iNzIiIHk9IjE5MCIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDIiIGZpbGw9IiNlOWU3ZmYiPk1BVCAxMDEg4oCiIE1BVEhFTUFUSUNTIEk8L3RleHQ+PHRleHQgeD0iNzIiIHk9IjI4NSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNjYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IndoaXRlIj5GVU5DVElPTlM8L3RleHQ+PHRleHQgeD0iNzYiIHk9IjM2MCIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IiNmMmVkZmYiPkRvbWFpbiDigKIgUmFuZ2Ug4oCiIEdyYXBocyDigKIgSW52ZXJzZXM8L3RleHQ+PHRleHQgeD0iNzcwIiB5PSI0NzUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjYwIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iLjg1Ij7iiJEgIOKIqyAg4oiaeDwvdGV4dD48L3N2Zz4="
    }
  }
});
