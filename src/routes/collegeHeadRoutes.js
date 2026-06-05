import express from "express";

const router = express.Router();

// Dashboard
router.get("/dashboard", async (req, res) => {
  res.json({
    stats: {
      departments: 5,
      departmentHeads: 5,
      students: 1000,
      faculty: 50,
    },
  });
});

// Departments
router.get("/departments", async (req, res) => {
  // fetch departments
});

router.post("/departments", async (req, res) => {
  // create department
});

router.put("/departments/:id", async (req, res) => {
  // update department
});

router.delete("/departments/:id", async (req, res) => {
  // delete department
});

export default router;