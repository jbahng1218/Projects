import * as Yup from "yup";

let serviceFormValidationSchema = () => {
  return Yup.object().shape({
    name: Yup.string()
      .required("The value for name must be within 2-100 characters")
      .min(2)
      .max(100),
    description: Yup.string()
      .required("The value for name must be within 2-300 characters")
      .min(2)
      .max(300),
    hasVeteranBenefits: Yup.bool().required(),
    isHostProvided: Yup.bool().required()
  });
};

export default serviceFormValidationSchema;