type GenericObject = Record<string, unknown>;

type ProcessAlert = (
  data: GenericObject | string,
  isJson?: boolean
) => GenericObject;

export const processAlert: ProcessAlert = (data, isJson) => {
  if (isJson) return { ...(data as GenericObject) };
  return { data };
};
