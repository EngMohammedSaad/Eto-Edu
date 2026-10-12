# Study Hub

افتح `index.html` في المتصفح وخلاص (مفيش سيرفر مطلوب).

## الشكل
```
index.html          الصفحة الوحيدة (الصفحات بتتبدّل بـ #/ )
css/style.css       كل التصميم
js/utils.js         أدوات: التخزين، اللغة، حجم الخط، تحميل الملفات
js/translate.js     الترجمة بالضغطة المطوّلة
js/exam.js          الامتحان
js/app.js           الصفحات والتنقل
data/subjects.js    قايمة التراكات والمواد
data/Geo/           داتا مادة الجيولوجيا (كلية علوم)
   lecture1.js      الشرح + المصطلحات + الصور
   questions1.js    أسئلة المحاضرة
data/Thanwaya/chem/ داتا كيمياء ثانوية عامة
   lecture2.js      المحاضرة 2 (الشرح + المصطلحات + الصور)
   questions2.js    الـ 50 سؤال
```

## إضافة مادة جديدة
1. اعمل فولدر جوه `data/` باسم المادة (مثلاً `data/Phys/`).
2. حط فيه `lecture1.js` و `questions1.js` بنفس شكل `data/Geo/`.
3. في `data/subjects.js` شيل `soon: true` من المادة وزوّد `files: [...]`.

## إضافة محاضرة لمادة موجودة
اعمل `lecture2.js` و `questions2.js` في فولدر المادة، وزوّدهم في `files` بتاعة المادة.

## المحاضرة 1 في كيمياء ثانوية عامة
مكانها محجوز (كارت Coming soon). لما تجهز: اعمل `lecture1.js` و `questions1.js` في `data/Thanwaya/chem/` (id: `chem-1`)،
زوّدهم في `files` بتاعة `chem-sec` في `data/subjects.js`، وشيل `placeholders: [{ number: 1 }]`.
