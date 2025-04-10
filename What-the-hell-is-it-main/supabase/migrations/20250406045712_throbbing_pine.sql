/*
  # Remove coins from user_stats table

  1. Changes
    - Remove coins column from user_stats table
    
  2. Security
    - No changes to RLS policies
*/

ALTER TABLE user_stats DROP COLUMN IF EXISTS coins;