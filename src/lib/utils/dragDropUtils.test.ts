/**
 * Tests for dragDropUtils - Block ID Normalization
 */

import { describe, it, expect } from 'vitest';
import { normalizeBlockId, normalizeOverId } from '../dragDropUtils';

describe('normalizeBlockId', () => {
  it('should return the same ID for already normalized block IDs', () => {
    const blockId = 'block-550e8400-e29b-41d4-a716-446655440000';
    expect(normalizeBlockId(blockId)).toBe(blockId);
  });

  it('should extract block ID from DnD wrapper format', () => {
    const wrappedId = 'dnd-block-1-block-550e8400-e29b-41d4-a716-446655440000';
    const expected = 'block-550e8400-e29b-41d4-a716-446655440000';
    expect(normalizeBlockId(wrappedId)).toBe(expected);
  });

  it('should extract block ID from step-prefixed format', () => {
    const prefixedId = '5-block-550e8400-e29b-41d4-a716-446655440000';
    const expected = 'block-550e8400-e29b-41d4-a716-446655440000';
    expect(normalizeBlockId(prefixedId)).toBe(expected);
  });

  it('should handle block IDs with multiple dashes in UUID', () => {
    const wrappedId = 'dnd-block-12-block-a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6';
    const expected = 'block-a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6';
    expect(normalizeBlockId(wrappedId)).toBe(expected);
  });

  it('should handle uppercase UUIDs', () => {
    const wrappedId = 'dnd-block-12-block-A1B2C3D4-E5F6-47A8-B9C0-D1E2F3A4B5C6';
    const expected = 'block-A1B2C3D4-E5F6-47A8-B9C0-D1E2F3A4B5C6';
    expect(normalizeBlockId(wrappedId)).toBe(expected);
  });

  it('should return null for null input', () => {
    expect(normalizeBlockId(null)).toBe(null);
  });

  it('should return null for undefined input', () => {
    expect(normalizeBlockId(undefined)).toBe(null);
  });

  it('should return null for empty string', () => {
    expect(normalizeBlockId('')).toBe(null);
  });

  it('should handle IDs without block- prefix (legacy or other formats)', () => {
    const legacyId = 'dnd-block-1-some-other-id-format';
    // Should return the string after removing dnd-block- prefix
    expect(normalizeBlockId(legacyId)).toBe('1-some-other-id-format');
  });

  it('should extract first block- occurrence when multiple exist', () => {
    const multipleBlockId = 'dnd-block-1-block-abc123-block-def456';
    // The fallback regex matches the longest block- pattern
    const expected = 'block-abc123-block-def456';
    expect(normalizeBlockId(multipleBlockId)).toBe(expected);
  });
});

describe('normalizeOverId (existing function)', () => {
  it('should remove dnd-block- prefix', () => {
    const id = 'dnd-block-1-block-abc123';
    const expected = '1-block-abc123';
    expect(normalizeOverId(id)).toBe(expected);
  });

  it('should return the same ID if no dnd-block- prefix', () => {
    const id = 'block-abc123';
    expect(normalizeOverId(id)).toBe(id);
  });

  it('should return null for null input', () => {
    expect(normalizeOverId(null)).toBe(null);
  });

  it('should return null for undefined input', () => {
    expect(normalizeOverId(undefined)).toBe(null);
  });
});
