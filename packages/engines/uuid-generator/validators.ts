const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_V1_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_ANY_REGEX = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i;

export function isValidUuid(input: string): boolean {
  return UUID_ANY_REGEX.test(input.trim());
}

export function isValidUuidV4(input: string): boolean {
  return UUID_V4_REGEX.test(input.trim());
}

export function isValidUuidV1(input: string): boolean {
  return UUID_V1_REGEX.test(input.trim());
}
