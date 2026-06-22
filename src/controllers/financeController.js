import Finance from "../models/Finance.js";

export const createPayment =
  async (req, res) => {
    try {

      const {
        student,
        paymentType,
        paymentMethod,
        amount,
        semester,
        academicYear,
        paidBy,
        remarks,
      } = req.body;

     const lastPayment =
  await Finance.findOne()
    .sort({ createdAt: -1 });

let receiptNumber =
  "REC00001";

if (
  lastPayment?.receiptNumber
) {
  const lastNumber =
    parseInt(
      lastPayment.receiptNumber.replace(
        "REC",
        ""
      )
    );

  receiptNumber =
    `REC${String(
      lastNumber + 1
    ).padStart(5, "0")}`;
}

      const finance =
        await Finance.create({
          student,
          paymentType,
          paymentMethod,
          amount,
          semester,
          academicYear,
          paidBy,
          remarks,
          receiptNumber,
          createdBy:
            req.user.id,
        });

      res.status(201).json(
        finance
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

  export const getPayments =
  async (req, res) => {

    try {

      const payments =
        await Finance.find()
          .populate({
  path: "student",
  select:
    "studentId firstName fatherName department",
  populate: {
    path: "department",
    select: "name",
  },
})
          .sort({
            createdAt: -1,
          });

      res.json(payments);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

  export const getPayment =
  async (req, res) => {

    try {

      const payment =
        await Finance.findById(
          req.params.id
        ).populate(
          "student"
        );

      res.json(payment);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

  export const updatePayment =
  async (req, res) => {

    try {

      const payment =
        await Finance.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(payment);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

  export const deletePayment =
  async (req, res) => {

    try {

      await Finance.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Payment deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

  export const getFinanceDashboard =
  async (req, res) => {

    try {

      const totalRevenue =
        await Finance.aggregate([
          {
            $match: {
              paymentType:
                "Paid",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum:
                  "$amount",
              },
            },
          },
        ]);

      const paidStudents =
        await Finance.countDocuments({
          paymentType:
            "Paid",
        });

      const fundedStudents =
        await Finance.countDocuments({
          paymentType:
            "Funded",
        });

      res.json({
        totalRevenue:
          totalRevenue[0]
            ?.total || 0,
        paidStudents,
        fundedStudents,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

  export const getFinanceStats =
  async (req, res) => {

    try {

      const totalPayments =
        await Finance.countDocuments();

      const totalRevenue =
        await Finance.aggregate([
          {
            $group: {
              _id: null,
              total: {
                $sum:
                  "$amount",
              },
            },
          },
        ]);

      const thisMonth =
        await Finance.countDocuments({
          createdAt: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ),
          },
        });

      res.json({
        totalPayments,
        totalRevenue:
          totalRevenue[0]
            ?.total || 0,
        thisMonth,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

  export const getReceipt =
  async (req, res) => {
    try {

      const payment =
        await Finance.findOne({
          receiptNumber:
            req.params.receiptNumber,
        })
        .populate("student");

      res.json(payment);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  };

  export const getMonthlyRevenue =
  async (req, res) => {

    try {

      const data =
        await Finance.aggregate([
          {
            $group: {
              _id: {
                month: {
                  $month:
                    "$createdAt",
                },
              },
              revenue: {
                $sum:
                  "$amount",
              },
            },
          },
        ]);

      res.json(data);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

export const getDepartmentRevenue =
  async (req, res) => {

    try {

      const data =
        await Finance.aggregate([
          {
            $lookup: {
              from: "students",
              localField: "student",
              foreignField: "_id",
              as: "student",
            },
          },

          {
            $unwind: "$student",
          },

          {
            $lookup: {
              from: "departments",
              localField:
                "student.department",
              foreignField: "_id",
              as: "department",
            },
          },

          {
            $unwind: "$department",
          },

          {
            $group: {
              _id:
                "$department.name",

              totalRevenue: {
                $sum:
                  "$amount",
              },

              totalPayments: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              totalRevenue: -1,
            },
          },
        ]);

      res.json(data);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

  export const getStudentPayments =
  async (req, res) => {

    try {

      const payments =
        await Finance.find({
          student:
            req.params.studentId,
        })
          .sort({
            createdAt: -1,
          });

      res.json(payments);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };