/*
  # Create Departments Management System

  1. New Tables
    - `departments`
      - `id` (uuid, primary key) - Unique identifier for each department
      - `name` (text, not null) - Department name
      - `description` (text) - Department description
      - `head` (text) - Name of department head/manager
      - `employee_count` (integer, default 0) - Number of employees in the department
      - `created_at` (timestamptz) - Timestamp when department was created
      - `updated_at` (timestamptz) - Timestamp when department was last updated
  
  2. Security
    - Enable RLS on `departments` table
    - Add policy for authenticated users to read all departments
    - Add policy for authenticated users to insert new departments
    - Add policy for authenticated users to update departments
    - Add policy for authenticated users to delete departments
*/

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  head text DEFAULT '',
  employee_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all departments"
  ON departments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert departments"
  ON departments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update departments"
  ON departments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete departments"
  ON departments
  FOR DELETE
  TO authenticated
  USING (true);