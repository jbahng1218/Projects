import * as Yup from "yup";

let reviewsFormValidationSchema = () => {
  return Yup.object().shape({
    rating: Yup.number()
      .required("Rate between 1-5")
      .min(1)
      .max(5),
    description: Yup.string()
      .required("The value for name must be within 2-1000 characters")
      .min(10)
      .max(1000)
  });
};

export default reviewsFormValidationSchema;
