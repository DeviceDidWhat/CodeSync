import mongoose from "mongoose";

/* -------------------- */
/* Reusable Type Schema */
/* -------------------- */

const TypeSchema = new mongoose.Schema({}, { _id: false });

TypeSchema.add({
  kind: {
    type: String,
    enum: ["primitive", "array"],
    required: true,
  },

  // For primitive types: int, string, bool, etc.
  name: {
    type: String,
    required: function () {
      return this.kind === "primitive";
    },
  },

  // For array types (recursive)
  element: {
    type: TypeSchema,
    required: function () {
      return this.kind === "array";
    },
  },
});

/* -------------------- */
/* Parameter Schema */
/* -------------------- */

const ParameterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: TypeSchema, required: true },
  },
  { _id: false }
);

/* -------------------- */
/* Example Schema */
/* -------------------- */

const ExampleSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
    explanation: String,
  },
  { _id: false }
);

/* -------------------- */
/* Test Case Schema */
/* -------------------- */

const TestCaseSchema = new mongoose.Schema(
  {
    input: {
      type: [mongoose.Schema.Types.Mixed], // ordered arguments
      required: true,
    },

    // MUST match your judge logic
    output: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

/* -------------------- */
/* Main Problem Schema */
/* -------------------- */

const ProblemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    category: {
      type: String,
    },

    description: {
      text: { type: String, required: true },
      notes: [String],
      constraints: [String],
    },

    examples: [ExampleSchema],

    functionName: {
      type: String,
      required: true,
    },

    parameters: {
      type: [ParameterSchema],
      required: true,
    },

    returnType: {
      type: TypeSchema,
      required: true,
    },

    /* ---------- Language-specific ---------- */
    starterCode: {
      cpp: {
        type: String,
        required: true,
      },
    },

    /* ---------- Judge-only ---------- */
    testCases: {
      type: [TestCaseSchema],
      select: false, //  hide from client
    },
  },
  { timestamps: true }
);

/* -------------------- */
/* Slug Normalization */
/* -------------------- */

ProblemSchema.pre("validate", function (next) {
  if (this.slug) {
    this.slug = this.slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  next();
});

export default mongoose.model("Problem", ProblemSchema);
