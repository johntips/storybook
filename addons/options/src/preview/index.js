import addons from '@storybook/addons';
import { EVENT_ID } from '../shared';

// init function will be executed once when the storybook loads for the
// first time. This is a good place to add global listeners on channel.
export function init() {
  // NOTE nothing to do here
}

let previewOptions = () => {};

function regExpStringify(exp) {
  if (!exp) return null;
  if (Object.prototype.toString.call(exp) === '[object String]') return exp;
  if (Object.prototype.toString.call(exp) !== '[object RegExp]') return null;
  return exp.source;
}

export function setPreviewOptionsFn(previewOptionsFn) {
  previewOptions = previewOptionsFn;
}

// setOptions function will send Storybook UI options when the channel is
// ready. If called before, options will be cached until it can be sent.
export function setOptions(options) {
  const channel = addons.getChannel();
  if (!channel) {
    throw new Error(
      'Failed to find addon channel. This may be due to https://github.com/storybooks/storybook/issues/1192.'
    );
  }
  const newOptions = options;
  if (options.hierarchySeparator)
    newOptions.hierarchySeparator = regExpStringify(options.hierarchySeparator);
  if (options.multistorySeparator)
    newOptions.multistorySeparator = regExpStringify(options.multistorySeparator);

  channel.emit(EVENT_ID, { options: newOptions });
  previewOptions(newOptions);
}
