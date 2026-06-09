import { Context } from "jsr:@hono/hono";
import { QuestionsService } from "../services/questions.service.ts";

class QuestionsHandler {
    private readonly questionsService: QuestionsService;
    constructor(questionsService: QuestionsService) {
        this.questionsService = questionsService;

        // bind methods
        this.deleteQuestion = this.deleteQuestion.bind(this);
    }

    async deleteQuestion(c: Context): Promise<Response> {
        const questionId = Number(c.req.query("id"));
        if (isNaN(questionId)) {
            return c.json({ error: "Invalid question ID" }, 400);
        }

        try {
            await this.questionsService.deleteQuestion(questionId);
            return c.body(null, 204);
        } catch {
            return c.json({ error: "Question does not exist" }, 404);
        }
    }
}

export default QuestionsHandler;