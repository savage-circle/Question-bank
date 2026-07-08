import { Question } from '../types/question';

const difficultyStyles: Record<string, string> = {
    Easy: 'bg-emerald-50 text-emerald-600',
    Medium: 'bg-orange-50 text-orange-700',
    Hard: 'bg-red-50 text-red-600',
};

const Card = ({question}: {question: Question}) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 font-sans">
            <p className="text-[17px] leading-relaxed text-gray-900 font-normal">{question.description}</p>
            <div className="flex mt-4 gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyStyles[question.levelName] ?? 'bg-slate-100 text-slate-600'}`}>
                    {question.levelName}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
                    {question.topicName}
                </span>
            </div>
        </div>
    )
}

export default Card;