/* ==========================================================
   data/subjects.js
   قايمة التراكات والمواد. لإضافة مادة: انسخ سطر مادة وغيّر بياناته.
   - files: ملفات الداتا بتاعة المادة (بتتحمّل لما تفتح المادة)
   - soon: true = "قريبًا" (من غير ملفات)
   - placeholders: محاضرات لسه مجهزتش بتظهر كارت "Coming soon" في مكانها
   لإضافة محاضرة جديدة لمادة: حط ملفاتها في فولدر المادة وزوّدها في files.
   ========================================================== */
window.SITE = {
  tracks: [
    {
      id: "science", code: "SCI",
      title: { en: "Faculty of Science", ar: "كلية العلوم" },
      desc:  { en: "University lectures, summaries and exams for science subjects.", ar: "محاضرات وملخصات وامتحانات لمواد كلية العلوم." },
      subjects: [
        { id: "geo", code: "GEO", title: { en: "Geology", ar: "الجيولوجيا" }, colors: ["#0e8a8a", "#12355b"],
          files: ["data/Geo/lecture1.js", "data/Geo/questions1.js"] },
        { id: "phys",   code: "PHY", title: { en: "Physics",       ar: "الفيزياء" },        colors: ["#2563eb", "#1e1b4b"], soon: true },
        { id: "chem",   code: "CHM", title: { en: "Chemistry",     ar: "الكيمياء" },        colors: ["#db2777", "#4c1d95"], soon: true },
        { id: "bot",    code: "BOT", title: { en: "Botany",        ar: "النبات" },          colors: ["#16a34a", "#14532d"], soon: true },
        { id: "zoo",    code: "ZOO", title: { en: "Zoology",       ar: "الحيوان" },         colors: ["#d97706", "#7c2d12"], soon: true },
        { id: "math",   code: "MTH", title: { en: "Mathematics",   ar: "الرياضيات" },       colors: ["#7c3aed", "#312e81"], soon: true }
      ]
    },
    {
      id: "secondary", code: "SEC",
      title: { en: "Thanaweya Amma", ar: "الثانوية العامة" },
      desc:  { en: "High school subjects. Chemistry for now.", ar: "مواد الثانوية العامة. الكيمياء حاليًا." },
      subjects: [
        { id: "chem-sec", code: "CHM", title: { en: "Chemistry", ar: "الكيمياء" }, colors: ["#db2777", "#4c1d95"],
          tools: ["periodic"],
          files: ["data/Thanwaya/chem/lecture1.js", "data/Thanwaya/chem/questions1.js",
                  "data/Thanwaya/chem/lecture2.js", "data/Thanwaya/chem/questions2.js",
                  "data/Thanwaya/chem/lecture3.js"] }
      ]
    }
  ]
};