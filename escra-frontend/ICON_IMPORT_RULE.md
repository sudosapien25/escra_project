# Icon Import Rule

## **RULE: Always Import Icons Before Using Them**

### **What This Means:**
- **NEVER use an icon** in your JSX/TSX without first importing it
- **ALWAYS add the icon** to the appropriate import statement before using it
- **Check existing imports** first to see if the icon is already available

### **Why This Rule Exists:**
1. **Prevents compilation errors** - Using unimported icons causes build failures
2. **Maintains code quality** - Clear dependencies make code more maintainable
3. **Avoids runtime errors** - Missing imports can cause unexpected behavior
4. **Team consistency** - Ensures all developers follow the same pattern

### **How to Follow This Rule:**

#### **Step 1: Check Existing Imports**
```tsx
// Look for existing icon imports at the top of the file
import { TbEdit, TbPencilShare } from 'react-icons/tb';
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';
```

#### **Step 2: Add Icon to Appropriate Import**
```tsx
// If you need TbTrash, add it to the Tb imports
import { TbEdit, TbPencilShare, TbTrash } from 'react-icons/tb';

// If you need HiOutlineTrash, add it to the Hi imports
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';
```

#### **Step 3: Use the Icon in Your JSX**
```tsx
// Now you can safely use the icon
<TbTrash className="w-4 h-4" />
```

### **Icon Library Guidelines:**

#### **Tb Icons (Tabler Icons)**
- **Use for:** Most UI actions, business functionality, modern interface elements
- **Examples:** `TbTrash`, `TbEdit`, `TbPlus`, `TbChevronDown`
- **Import from:** `react-icons/tb`

#### **Hi Icons (Heroicons)**
- **Use for:** Document-related actions, basic UI elements
- **Examples:** `HiOutlineDocumentText`, `HiOutlineEye`
- **Import from:** `react-icons/hi`

#### **Fa Icons (Font Awesome)**
- **Use for:** Business-specific actions, financial elements
- **Examples:** `FaFileContract`, `FaMoneyBillAlt`, `FaCheck`
- **Import from:** `react-icons/fa`

#### **Lu Icons (Lucide Icons)**
- **Use for:** General UI actions, navigation
- **Examples:** `LuPen`, `LuDownload`
- **Import from:** `react-icons/lu`

### **Common Mistakes to Avoid:**

❌ **Don't do this:**
```tsx
// Using icon without importing it
<TbTrash className="w-4 h-4" />

// Missing import statement
import { TbEdit } from 'react-icons/tb';
```

✅ **Do this instead:**
```tsx
// Import first, then use
import { TbEdit, TbTrash } from 'react-icons/tb';

// Now use the icon
<TbTrash className="w-4 h-4" />
```

### **Before Committing Code:**
1. **Check that all icons used** are properly imported
2. **Verify no compilation errors** related to missing icons
3. **Ensure consistent icon usage** across similar components
4. **Remove unused icon imports** to keep code clean

### **Remember:**
- **Import first, use second**
- **Check existing imports** before adding new ones
- **Group similar icons** in the same import statement
- **Keep imports organized** by icon library

---

**This rule applies to ALL files in the project. Follow it consistently to maintain code quality and prevent build errors.**
