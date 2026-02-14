const validate = (schema, source = "body") => {
   return (req, res, next) => {
      const { error, value } = schema.validate(req[source], {
         abortEarly: false,
         stripUnknown: true,
      });

      if (error) {
         const errors = error.details.map((detail) => detail.message);
         return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
         });
      }

      if (!req.validated) {
         req.validated = {};
      }
      req.validated[source] = value;

      next();
   };
};

export default validate;
