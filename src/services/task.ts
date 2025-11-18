import { BaseService } from "./base-service";
import { AppError } from "../types/response";
import { CreateTaskInput, UpdateTaskInput } from "../schemas";
import { docClient } from "../utils/dynamodb";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "Tasks";

export class TaskService extends BaseService {
  // CREATE - Criar nova tarefa
  async create(data: CreateTaskInput) {
    const task = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: task,
      })
    );

    return task;
  }

  // READ - Listar todas as tarefas
  async list() {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    return result.Items || [];
  }

  // READ - Buscar tarefa por ID
  async getById(id: string) {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    if (!result.Item) {
      throw new AppError(404, "Task not found", "TASK_NOT_FOUND");
    }

    return result.Item;
  }

  // READ - Buscar tarefas por data
  async getByDate(date: string) {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "#date = :date",
        ExpressionAttributeNames: {
          "#date": "date",
        },
        ExpressionAttributeValues: {
          ":date": date,
        },
      })
    );

    return result.Items || [];
  }

  // UPDATE - Atualizar tarefa
  async update(id: string, data: UpdateTaskInput) {
    // Verificar se existe
    await this.getById(id);

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Construir expressões dinâmicas
    if (data.title !== undefined) {
      updateExpressions.push("#title = :title");
      expressionAttributeNames["#title"] = "title";
      expressionAttributeValues[":title"] = data.title;
    }

    if (data.description !== undefined) {
      updateExpressions.push("#description = :description");
      expressionAttributeNames["#description"] = "description";
      expressionAttributeValues[":description"] = data.description;
    }

    if (data.date !== undefined) {
      updateExpressions.push("#date = :date");
      expressionAttributeNames["#date"] = "date";
      expressionAttributeValues[":date"] = data.date;
    }

    // Sempre atualizar updatedAt
    updateExpressions.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
    );

    // Buscar tarefa atualizada
    return await this.getById(id);
  }

  // DELETE - Deletar tarefa
  async delete(id: string) {
    // Verificar se existe
    await this.getById(id);

    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );
  }
}
