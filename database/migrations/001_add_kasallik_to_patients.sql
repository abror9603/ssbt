-- Create ENUM type for kasallik
CREATE TYPE kasallik_turi AS ENUM (
    'diabet',
    'gipertenziya',
    'astma',
    'yurak_kasalligi',
    'hech_narsa'
);

-- Add kasallik column to patients table
ALTER TABLE patients
ADD COLUMN kasallik kasallik_turi NOT NULL DEFAULT 'hech_narsa';

