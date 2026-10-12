/* ==========================================================
   ETO.Edu - Animated Duas and Quranic Reminders
   Type each phrase, keep it visible for 5 seconds, then erase it.
   File: data/cons.doaa.js
   ========================================================== */
(() => {
    "use strict";

    const title = document.getElementById("doaaTypingTitle");
    if (!title) return;

    const phrases = [
        "توكل على الله",
        "إنا لا نضيع أجر من أحسن عملا",
        "فإن الله لا يضيع أجر المحسنين",
        "وقل رب زدني علما",
        "فإن مع العسر يسرا",
        "إن مع العسر يسرا",
        "حسبنا الله ونعم الوكيل",
        "ومن يتوكل على الله فهو حسبه",
        "ألا بذكر الله تطمئن القلوب",
        "إن الله مع الصابرين",
        "لا تقنطوا من رحمة الله",
        "وما توفيقي إلا بالله",
        "فاذكروني أذكركم",
        "ادعوني أستجب لكم",
        "رب اشرح لي صدري ويسر لي أمري",
        "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة",
        "ربنا تقبل منا إنك أنت السميع العليم",
        "ربنا لا تزغ قلوبنا بعد إذ هديتنا",
        "وعسى أن تكرهوا شيئا وهو خير لكم",
        "إن الله يحب المتوكلين",
        "واصبر وما صبرك إلا بالله",
        "لا يكلف الله نفسا إلا وسعها",
        "ومن يعمل مثقال ذرة خيرا يره",
        "ومن يتق الله يجعل له مخرجا",
        "قل لن يصيبنا إلا ما كتب الله لنا",
        "رب إني لما أنزلت إلي من خير فقير",
        "ربنا أفرغ علينا صبرا وثبت أقدامنا",
        "ربنا لا تحملنا ما لا طاقة لنا به",
        "اللهم وفقني لما تحب وترضى",
        "اللهم ارزقني علما نافعا",
        "اللهم انفعني بما علمتني وعلمني ما ينفعني وزدني علما",
        "اللهم لا سهل إلا ما جعلته سهلا",
        "اللهم إني أسألك علما نافعا ورزقا طيبا وعملا متقبلا",
        "يا حي يا قيوم برحمتك أستغيث أصلح لي شأني كله",
        "اللهم أعني على ذكرك وشكرك وحسن عبادتك",
        "اللهم إني أسألك الهدى والتقى والعفاف والغنى",
        "اللهم اجعل القرآن ربيع قلبي ونور صدري",
        "اللهم بارك لي في وقتي وجهدي",
        "اللهم اجعل عملي خالصا لوجهك الكريم",
        "اللهم اجعل سعيي مباركا وعملي متقبلا",
        "رب زدني علما",
        "لا تحزن إن الله معنا",
        "ومن يتق الله يجعل له من أمره يسرا",
        "إن ربي قريب مجيب",
        "ربنا عليك توكلنا وإليك أنبنا وإليك المصير",
        "فصبر جميل والله المستعان",
        "اللهم افتح علي وعلمني ما ينفعني",
        "يا رب لا تضيع لي تعبا ولا تخيب لي رجاء",
        "اللهم يسّر لي أمري واشرح لي صدري",
        "اللهم اجعل القادم خيرا مما مضى",
        "اللهم ارزقني قوة التركيز وحسن الفهم",
        "اللهم ثبت ما تعلمت وذكرني به عند حاجتي إليه",
        "اللهم بارك في علمي وعملي ووقتي",
        "سأجتهد وأتوكل على الله ثم أرضى بما يقدره لي",
        "خطوة صغيرة كل يوم تصنع فرقا كبيرا",
        "ابدأ مستعينا بالله ولا تستسلم",
        "اللهم ارزقني الإخلاص والتوفيق والسداد",
        "ربنا آتنا من لدنك رحمة وهيئ لنا من أمرنا رشدا",
        "إن ربي لطيف لما يشاء",
        "وهو معكم أينما كنتم",
        "إن رحمة الله قريب من المحسنين"
    ];

    const TYPE_SPEED = 85;
    const ERASE_SPEED = 32;
    const FULL_TEXT_PAUSE = 5000;
    const BETWEEN_PHRASES_PAUSE = 350;
    const prefersReducedMotion = window.matchMedia
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const style = document.createElement("style");
    style.textContent = `
        .top .brand { min-width: 0; }
        .top .brand #doaaTypingTitle {
            display: inline-block;
            min-width: 10ch;
            max-width: min(46vw, 420px);
            white-space: normal;
            overflow-wrap: anywhere;
            line-height: 1.6;
        }
        .top .brand #doaaTypingTitle::after {
            content: "";
            display: inline-block;
            width: 2px;
            height: 1em;
            margin-inline-start: 4px;
            background: currentColor;
            vertical-align: -0.15em;
            animation: doaaTypingCaret 0.9s steps(1, end) infinite;
        }
        @keyframes doaaTypingCaret {
            50% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
            .top .brand #doaaTypingTitle::after { animation: none; }
        }
    `;
    document.head.appendChild(style);

    let phraseIndex = 0;

    function typePhrase() {
        const characters = Array.from(phrases[phraseIndex]);
        let visibleCount = 0;
        title.textContent = "";

        function showCompletePhrase() {
            title.textContent = characters.join("");
            window.setTimeout(erasePhrase, FULL_TEXT_PAUSE);
        }

        function typeNextCharacter() {
            if (prefersReducedMotion) {
                showCompletePhrase();
                return;
            }

            if (visibleCount < characters.length) {
                visibleCount += 1;
                title.textContent = characters.slice(0, visibleCount).join("");
                window.setTimeout(typeNextCharacter, TYPE_SPEED);
            } else {
                window.setTimeout(erasePhrase, FULL_TEXT_PAUSE);
            }
        }

        function erasePhrase() {
            if (prefersReducedMotion) {
                title.textContent = "";
                moveToNextPhrase();
                return;
            }

            if (visibleCount > 0) {
                visibleCount -= 1;
                title.textContent = characters.slice(0, visibleCount).join("");
                window.setTimeout(erasePhrase, ERASE_SPEED);
            } else {
                moveToNextPhrase();
            }
        }

        function moveToNextPhrase() {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            window.setTimeout(typePhrase, BETWEEN_PHRASES_PAUSE);
        }

        typeNextCharacter();
    }

    typePhrase();
})();
