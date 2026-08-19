const FAQS = [
  {
    q: "What is DecisionOS?",
    a: "DecisionOS is a 30-day behavioral-economics research study. Each day you'll face a short financial scenario, choose how you'd actually respond, and get feedback on any decision-making patterns we notice.",
  },
  {
    q: "Is there a right or wrong answer?",
    a: "No. We're interested in what you would genuinely do, not what sounds best. There are no scored 'correct' choices.",
  },
  {
    q: "Is my data anonymous?",
    a: "Your responses are linked only to your account and are used for aggregate research analysis. We never share individual responses.",
  },
  {
    q: "What happens if I miss a day?",
    a: "Nothing breaks — you can pick up the next scenario whenever you come back.",
  },
  {
    q: "What are 'biases'?",
    a: "Biases like Present Bias or Loss Aversion are well-studied patterns in how people make financial decisions. We infer them from your choices to help you notice your own patterns.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-text">Help & FAQ</h1>
      <p className="mt-1 text-sm text-text-muted">
        Common questions about the study and how it works.
      </p>

      <div className="mt-6 space-y-3">
        {FAQS.map((faq) => (
          <div key={faq.q} className="card p-5">
            <p className="text-sm font-semibold text-text">{faq.q}</p>
            <p className="mt-2 text-sm text-text-muted">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
