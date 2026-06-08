# Database Structure

# Categories

Stores application categories.

| Field | Type    | Description   |
| ----- | ------- | ------------- |
| Id    | Integer | Primary Key   |
| Name  | String  | Category Name |

---

# Topics

Stores topics based on category.

| Field      | Type    | Description                   |
| ---------- | ------- | ----------------------------- |
| Id         | Integer | Primary Key                   |
| Name       | String  | Topic Name                    |
| CategoryId | Integer | Reference to Categories table |

# Questions

Stores all questions.

| Field       | Type    | Description                                   |
| ----------- | ------- | --------------------------------------------- |
| Id          | Integer | Primary Key                                   |
| Description | Text    | Question Description                          |
| TopicId     | Integer | Reference to Topics table                     |
| LevelId     | Integer | Enum value ("Easy", "Medium", "Hard")         |
| Extensions  | Text    | Stringified JSON Array of extension questions |

---

# Relationships

- One Category can have many Topics
- One Topic can have many Questions
- One Level can have many Questions

---

# Extensions Format

Extensions are stored as a stringified JSON array.

Example:

```json
[
  "First extension question",
  "Second extension question"
]
```
