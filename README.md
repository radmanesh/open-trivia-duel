# Open Trivia Game

A multi round trivia game built with Open Trivia API.

## Game flow

Here's the game flow:

1. **Welcome to the Quiz Game:**

   - User provides their name.
   - User selects the number of rounds to play.
   - User specifies the number of questions per round.
   - User selects the question difficulty (easy, medium, hard).

2. **Category Selection:**

   - User is prompted to select a category for the current round from a list of available categories.
   - Once a category is selected for a round, it is removed from the list of available categories for subsequent rounds.

3. **Question Display:**

   - Questions corresponding to the selected category are displayed.
   - Each question is presented with a countdown timer based on its difficulty level (90 seconds for easy, 60 seconds for medium, 30 seconds for hard).
   - User can answer or skip any question except for the last one.

4. **Automatic Skip:**

   - If the countdown timer elapses and the user hasn't provided an answer, the question is automatically skipped.
   - If it's the last question of the round, the game proceeds to the next round or the score screen based on the remaining rounds.

5. **Round Completion:**

   - If there are remaining rounds, the user is prompted to select a new category for the next round.
   - Repeat the same process until all rounds are completed.

6. **Finish Game:**

   - User clicks on the "Finish Game" button after completing all rounds.
   - User is redirected to the score screen.

7. **Score Screen:**
   - Display game completion time.
   - Show the total score.
   - Include a pie chart to visualize the distribution of correct, wrong, and skipped questions.
   - Display a stacked bar chart to visualize correct and incorrect answers (wrong or skipped) for each round.
   - Provide a line chart to show the time taken for the user to answer each question.

## Tech Stack

- Next.js - for bootstraping a react project
- Shadcn-ui - for components
- Tailwindcss - for styling
- Open Trivia Database - for trivia questions
- Tanstack Query (previously react-query) - for fetching data

## How to run locally

- Clone the repo `git clone https://github.com/ahmedsomaa/open-trivia.git`
- Install dependencies `cd open-trivia && pnpm install`
- Start the dev server `pnpm dev`

## Demos

### Normal Game Flow

https://github.com/ahmedsomaa/open-trivia/assets/29373629/9ed386f6-821f-4983-b169-b16d7c35212a

### Question Timeout

https://github.com/ahmedsomaa/open-trivia/assets/29373629/7347140b-9da0-4998-8df1-fac87aad5832

