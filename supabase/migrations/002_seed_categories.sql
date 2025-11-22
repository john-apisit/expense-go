-- This migration will be run after user signs up to seed default categories
-- Function to seed default categories for a new user
CREATE OR REPLACE FUNCTION seed_default_categories(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Default expense categories
  INSERT INTO categories (user_id, name, type) VALUES
    (p_user_id, 'อาหารและเครื่องดื่ม', 'expense'),
    (p_user_id, 'ค่าเดินทาง', 'expense'),
    (p_user_id, 'ค่าน้ำค่าไฟ', 'expense'),
    (p_user_id, 'ค่าบ้าน ปรับปรุงบ้าน', 'expense'),
    (p_user_id, 'ค่ารถ บำรุงรถ', 'expense'),
    (p_user_id, 'ช้อปปิ้ง', 'expense'),
    (p_user_id, 'สุขภาพและความงาม', 'expense'),
    (p_user_id, 'บันเทิง', 'expense'),
    (p_user_id, 'การศึกษา', 'expense'),
    (p_user_id, 'ประกัน', 'expense'),
    (p_user_id, 'อื่นๆ', 'expense');

  -- Default income categories
  INSERT INTO categories (user_id, name, type) VALUES
    (p_user_id, 'เงินเดือน', 'income'),
    (p_user_id, 'โบนัส', 'income'),
    (p_user_id, 'รายได้เสริม', 'income'),
    (p_user_id, 'อื่นๆ', 'income');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

