import { FileText } from 'lucide-react';
import SectionShell from './SectionShell';
import CardRow from './CardRow';

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

const Research = () => (
    <SectionShell id="research" index="06" title="Research Publications">
        <CardRow
            label="Research publications"
            items={publications.map((pub) => ({
                key: pub.link,
                content: (
                    <article className="card p-5 xl:p-6">
                        <div className="flex items-center justify-between gap-6">
                            <p className="meta uppercase">{pub.publisher}</p>
                            <a href={pub.link} target="_blank" rel="noopener noreferrer" className="link-quiet shrink-0" aria-label={`Read paper: ${pub.title}`}>
                                Read paper <FileText size={15} aria-hidden="true" />
                            </a>
                        </div>
                        <h3 className="mt-3 text-lg xl:text-xl leading-snug">{pub.title}</h3>
                        <p className="mt-2 font-serif italic text-[1.05rem] leading-snug text-muted">{pub.conference}</p>
                        <ul className="mt-4 space-y-2">
                            {pub.bullets.map((bullet) => (
                                <li key={bullet} className="bullet card-text text-muted">
                                    {bullet}
                                </li>
                            ))}
                        </ul>
                    </article>
                ),
            }))}
        />
    </SectionShell>
);

export default Research;
