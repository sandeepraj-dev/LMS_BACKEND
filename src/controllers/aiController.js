// controllers/aiController.js

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey:
    process.env.GEMINI_API_KEY || "AIzaSyCI7uMuO0bI1RuxDvkPhtr8ddrxVmAd - Fo",
});

exports.generateQuestions = async (req, res) => {
  try {
    const { prompt, classroomId, examId, count, difficulty } = req.body;

    const fullPrompt = `
You are a JSON API.

Generate exactly ${count} ${difficulty} level MCQ questions.

Topic:
${prompt}

Return ONLY a valid JSON array.

Rules:
1. No markdown.
2. No explanation.
3. No extra text.
4. Each question must contain exactly 4 options.
5. The answer must match one of the options.
6. marks must always be 2.
7. Include classroomId = "${classroomId}" in every object.
8. Include examId = "${examId}" in every object.

Example:

[
  {
    "classroomId":"${classroomId}",
    "examId":"${examId}",
    "question":"What does SQL stand for?",
    "options":[
      "Structured Query Language",
      "Simple Query Language",
      "System Query Language",
      "Standard Query Language"
    ],
    "answer":"Structured Query Language",
    "marks":2
  }
]
`;

    let questions = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`Attempt ${attempt}`);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      let text =
        response.text ||
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "";

      text = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      try {
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed)) {
          questions = parsed;
          break;
        }
      } catch (err) {
        console.log(`Invalid JSON on attempt ${attempt}`);
      }
    }

    if (!questions) {
      return res.status(500).json({
        success: false,
        message: "Unable to generate valid JSON",
      });
    }

    // Safety: ensure IDs exist even if Gemini forgets
    questions = questions.map((q) => ({
      classroomId,
      examId,
      question: q.question,
      options: q.options,
      answer: q.answer,
      marks: q.marks || 2,
    }));

    return res.json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
