import { Question, CreateQuestionDTO } from "../types/question.ts";
import { FollowUpSummary, CreateFollowUpDTO } from "../types/followUp.ts";
import { IService } from "./IService.ts";

export interface IQuestionService extends IService<Question, CreateQuestionDTO> {
  getFollowUpsAsync(questionId: number): Promise<FollowUpSummary[]>;
  followUpExistsAsync(followUpId: number, questionId: number): Promise<boolean>;
  addFollowUpAsync(questionId: number, data: CreateFollowUpDTO): Promise<FollowUpSummary>;
  updateFollowUpAsync(followUpId: number, data: CreateFollowUpDTO): Promise<FollowUpSummary>;
  deleteFollowUpAsync(followUpId: number): Promise<void>;
}
