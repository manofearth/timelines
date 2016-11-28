import { FormGroup } from '@angular/forms';
import * as mapValues from 'lodash/mapValues';
import * as property from 'lodash/property';
import * as values from 'lodash/values';
import { ifEmptyObject } from './helpers';

export function composeChildrenValidators(form: FormGroup): null | {} {

  const errors = values(mapValues(form.controls, property('errors')));
  const mergedErrors = Object.assign({}, ...errors);

  return ifEmptyObject(mergedErrors, null);
}
