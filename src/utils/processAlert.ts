import { isEmpty } from "lodash";
import { GenericObject, InfoObject, Command, Alert } from "./types";

interface ProcessAlertArgs {
  jsonData?: GenericObject;
  textData?: string;
}

const getNecessaryData = ({ jsonData, textData }: ProcessAlertArgs) => {
  let licenseId = "";
  let command = "";
  let symbol = "";

  if (!isEmpty(jsonData)) {
    licenseId = jsonData?.licenseId?.toString() ?? "";
    command = jsonData?.command?.toString()?.toUpperCase() ?? "";
    symbol = jsonData?.symbol?.toString() ?? "";
  }

  if (!isEmpty(textData)) {
    const [lic, com, sym] = textData?.split(",") ?? [];
    licenseId = lic?.toString() ?? "";
    command = com?.toString()?.toUpperCase() ?? "";
    symbol = sym?.toString() ?? "";
  }

  return {
    licenseId,
    command,
    symbol,
    hasNecessaryData:
      !isEmpty(licenseId) &&
      Number.isInteger(Number(licenseId)) &&
      Object.values(Command).includes(command as Command) &&
      !isEmpty(symbol),
  };
};

// ['risk=0.5', 'sl=123', 'comment="hey"'] => { risk: 0.5, sl: 123, comment: "hey" }
const processSecondaryInfo = (commandList: string[]): InfoObject => {
  if (isEmpty(commandList)) return {};
  const res: InfoObject = {};

  commandList.forEach((item) => {
    const [key, value] = item.split("=");
    if (!isNaN(Number(value))) {
      res[key] = Number(value);
    } else if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      res[key] = value.slice(1, -1);
    } else {
      res[key] = value;
    }
  });

  return res;
};

export const processAlert = ({
  jsonData,
  textData,
}: ProcessAlertArgs): Alert | null => {
  if (!isEmpty(jsonData)) {
    const { licenseId, command, symbol, hasNecessaryData } = getNecessaryData({
      jsonData,
    });
    if (!hasNecessaryData) return null;
    const alert: Alert = {
      ...jsonData,
      licenseId,
      command: command as Alert["command"],
      symbol,
    };
    return alert;
  }

  const { licenseId, command, symbol, hasNecessaryData } = getNecessaryData({
    textData,
  });
  if (!hasNecessaryData) return null;
  const [_, __, ___, ...info] = textData?.split(",") ?? [];
  const rest = processSecondaryInfo(info);
  const alert: Alert = {
    ...rest,
    licenseId,
    command: command as Alert["command"],
    symbol,
  };
  return alert;
};
