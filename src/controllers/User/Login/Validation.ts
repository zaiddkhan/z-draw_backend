import vine,{ SimpleMessagesProvider } from "@vinejs/vine";


const fields = {
    name: "Name",
    email: "Email",
  };
  
  const signUpMessagesProvider = new SimpleMessagesProvider(
    {
      // Applicable for all fields
      required: "The {{ field }} field is required",
      string: "The value of {{ field }} field must be a string",
      email: "The value is not a valid email address",
  
      // Error message for the custom fields
      "name.required": "Please enter name",
      "email.required": "Please enter email"
    },
    fields
  );

 const singUpSchema = vine.object({
    name: vine.string().minLength(5),
    email: vine.string().email()
  });
  const signUpValidator = vine.compile(singUpSchema);


  signUpValidator.messagesProvider = signUpMessagesProvider;

  export default signUpValidator
  

   


