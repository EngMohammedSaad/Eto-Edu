
window.SITE = {
  pdfProxy: "https://crimson-block-55e3.elembe999.workers.dev",
  tracks: [
    {
      id: "science", code: "SCI",
      title: { en: "Faculty of Science", ar: "كلية العلوم" },
      desc:  { en: "University lectures, summaries and exams for science subjects.", ar: "محاضرات وملخصات وامتحانات لمواد كلية العلوم." },
      subjects: [
        { id: "geo", code: "GEO", title: { en: "Geology", ar: "الجيولوجيا" }, colors: ["#0e8a8a", "#12355b"],
          files: ["data/Geo/lecture1.js", "data/Geo/questions1.js"] },
        { id: "phys", code: "PHY", title: { en: "Physics", ar: "الفيزياء" }, colors: ["#2563eb", "#1e1b4b"],
          files: ["data/Phys/lecture1.js","data/Phys/lecture2.js", "data/Phys/questions1.js","data/Phys/questions2.js", "data/Phys/formulas.js", "data/Phys/converter.js"],
          tools: ["formulas", "converter"] },
        { id: "chem", code: "CHM", title: { en: "Chemistry", ar: "الكيمياء" }, colors: ["#db2777", "#4c1d95"],
          files: ["data/Chem/lecture1.js", "data/Chem/lecture2.js","data/Chem/questions1.js","data/Chem/questions2.js"] },
        { id: "bot", code: "BOT", title: { en: "Botany", ar: "النبات" }, colors: ["#16a34a", "#14532d"], soon: true },
        { id: "zoo", code: "ZOO", title: { en: "Zoology", ar: "الحيوان" }, colors: ["#d97706", "#7c2d12"], soon: true },
        { id: "math", code: "MTH", title: { en: "Mathematics", ar: "الرياضيات" }, colors: ["#7c3aed", "#312e81"],
          files: ["data/Maths/lecture1.js", "data/Maths/questions1.js", "data/Maths/solutions.js", "data/Maths/tutor.js"],
          exams: ["data/Maths/exams/Exam1_Algebra_Preliminaries.pdf", "data/Maths/exams/Exam2_Equations_Inequalities.pdf", "data/Maths/exams/Exam3_Quadratic_Absolute_Inequalities.pdf"] }
      ]
    },
    {
      id: "secondary", code: "SEC",
      title: { en: "Thanaweya Amma", ar: "الثانوية العامة" },
      desc:  { en: "High school subjects. Chemistry for now.", ar: "مواد الثانوية العامة. الكيمياء حاليًا." },
      subjects: [
        { id: "chem-sec", code: "CHM", title: { en: "Chemistry", ar: "الكيمياء" }, colors: ["#db2777", "#4c1d95"],
          tools: ["periodic", "oxidation","nminus","ssp"],
          files: ["data/Thanwaya/chem/lecture1.js", "data/Thanwaya/chem/questions1.js",
                  "data/Thanwaya/chem/lecture2.js", "data/Thanwaya/chem/questions2.js",
                  "data/Thanwaya/chem/lecture3.js"] }
      ]
    }
  ]
};
 