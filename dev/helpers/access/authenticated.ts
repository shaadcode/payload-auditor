// @ts-ignore
export const authenticated = ({ req: { user } }) => {
  return Boolean(user);
};
