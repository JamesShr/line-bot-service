/* eslint-disable @typescript-eslint/camelcase */
import {
  object, string, number, array, boolean,
} from 'yup';

export const updateScenarioValidation = object().shape({
  ssid: string().required(),
  password: string().required(),
});
