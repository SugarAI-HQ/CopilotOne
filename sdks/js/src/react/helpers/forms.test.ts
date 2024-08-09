// describe("formatPhoneNumber", () => {
//   test("formats a standard 10-digit phone number without hyphens", () => {
//     const result = formatPhoneNumber("1234567890");
//     expect(result).toBe("1234-567-890");
//   });

//   test("formats a 10-digit phone number with hyphens", () => {
//     const result = formatPhoneNumber("123-456-7890");
//     expect(result).toBe("1234-567-890");
//   });

//   test("formats a 10-digit phone number with spaces", () => {
//     const result = formatPhoneNumber("123 456 7890");
//     expect(result).toBe("1234-567-890");
//   });

//   test("formats a 10-digit phone number with mixed hyphens and spaces", () => {
//     const result = formatPhoneNumber("123-456 7890");
//     expect(result).toBe("1234-567-890");
//   });

//   test("throws an error for a phone number with less than 10 digits", () => {
//     expect(() => formatPhoneNumber("123456789")).toThrow(
//       "Phone number must be 10 digits long",
//     );
//   });

//   test("throws an error for a phone number with more than 10 digits", () => {
//     expect(() => formatPhoneNumber("12345678901")).toThrow(
//       "Phone number must be 10 digits long",
//     );
//   });

//   test("throws an error for an empty phone number", () => {
//     expect(() => formatPhoneNumber("")).toThrow(
//       "Phone number must be 10 digits long",
//     );
//   });

//   test("formats phone numbers with special characters (which should be removed)", () => {
//     const result = formatPhoneNumber("(123) 456-7890");
//     expect(result).toBe("1234-567-890");
//   });
// });
