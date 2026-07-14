export const getLetterGrade = (total) => {

  if (total >= 90) return "A";
  if (total >= 80) return "B";
  if (total >= 70) return "C";
  if (total >= 60) return "D";

  return "F";

};

export const getGradePoint = (letter) => {

  switch (letter) {

    case "A":
      return 4.0;

    case "B":
      return 3.0;

    case "C":
      return 2.0;

    case "D":
      return 1.0;

    default:
      return 0.0;

  }

};

export const calculateGrade = ({

  assignment = 0,

  quiz = 0,

  midExam = 0,

  finalExam = 0,

}) => {

  const total =
    Number(assignment) +
    Number(quiz) +
    Number(midExam) +
    Number(finalExam);

  const letterGrade =
    getLetterGrade(total);

  const gradePoint =
    getGradePoint(letterGrade);

  const status =
    total >= 60
      ? "Passed"
      : "Failed";

  return {

    total,

    letterGrade,

    gradePoint,

    status,

  };

};