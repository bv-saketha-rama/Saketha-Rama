const publications = [
    {
        title: "Experimental Analysis of Machine Learning Classification Models on Medical Datasets",
        conference: "ICDSMLA 2022: 4th International Conference on Data Science, Machine Learning and Applications",
        link: "https://link.springer.com/chapter/10.1007/978-981-99-2058-7_29",
        publisher: "Springer",
        bullets: [
            "Conducted empirical comparison of classification models (Logistic Regression, Decision Tree, SVM, Naive Bayes, KNN, Random Forest) on various medical datasets.",
            "Analyzed performance metrics to determine the most suitable classification model for different medical data scenarios.",
            "Achieved SVM accuracy of 0.59 on Diabetic dataset and Random Forest accuracy of 0.9974 on Breast Cancer Wisconsin dataset."
        ]
    },
    {
        title: "A Study on Application of Machine Learning Models for Autism Diagnosis",
        conference: "ICAIHC 2023: 2nd International Conference on Ambient Intelligence in Health Care",
        link: "https://ieeexplore.ieee.org/abstract/document/10431469",
        publisher: "IEEE Explore",
        bullets: [
            "Investigated machine learning applications for autism diagnosis, analyzing complexity and highlighting challenges in interpretability and bias detection.",
            "Applied various algorithms to an Autism Spectrum Disorder (ASD) dataset containing 931 samples and 103 features.",
            "Demonstrated that the Random Forest model achieved 100% performance across accuracy, precision, recall, and F1 score."
        ]
    },
    {
        title: "Overview of Thalassemia: A Review Work",
        conference: "ICABCS 2023: International Conference on Artificial Intelligence, Blockchain, Computing and Security",
        link: "https://www.taylorfrancis.com/chapters/edit/10.1201/9781003393580-118/overview-thalassemia-review-work-ruqqaiya-begum-suryanarayana-saketha-rama-swapna",
        publisher: "Taylor & Francis",
        bullets: [
            "Conducted comprehensive research on Thalassemia classifications: Alpha (α), Beta (β), and Delta-Beta (δβ).",
            "Provided statistical insights: 4.4 out of every 10,000 newborns affected globally; 10,000 to 12,000 children born annually in India.",
            "Discussed treatment methods like blood transfusions and bone marrow transplants to increase awareness and diagnosis rates."
        ]
    }
];

const Research = () => {
    return (
        <section id="research" className="py-12 border-b border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8">Research Publications</h2>

            <div className="space-y-6">
                {publications.map((pub, index) => (
                    <div key={index} className="group p-6 md:p-8 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[2.5rem] hover:border-[var(--color-accent)] transition-all duration-500 shadow-sm hover:shadow-xl">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                            <div className="flex-1">
                                <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full text-[var(--color-accent)] mb-3">
                                    {pub.publisher}
                                </span>
                                <h3 className="text-xl font-bold text-[var(--color-text)] leading-tight mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                                    {pub.title}
                                </h3>
                                <p className="text-sm font-medium text-[var(--color-text-secondary)] italic">
                                    {pub.conference}
                                </p>
                            </div>
                            <a
                                href={pub.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                            >
                                Read Paper
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                            </a>
                        </div>

                        <ul className="space-y-3">
                            {pub.bullets.map((bullet, i) => (
                                <li key={i} className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex gap-3">
                                    <span className="text-[var(--color-accent)] font-bold">•</span>
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Research;
