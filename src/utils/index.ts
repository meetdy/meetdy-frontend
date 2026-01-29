export function generateCode(length: number): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const getClassifyOfObject = (chatId: string, classifies: any[]) => {
  return classifies.find((ele) =>
    ele.conversationIds.find((id: string) => id === chatId),
  );
};