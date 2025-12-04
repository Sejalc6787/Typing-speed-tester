# Team Section Setup Guide

## Overview

The Team section has been added to the navbar with a dedicated modal showcasing team members: **Sejal Choudhary** and **Shreya**.

## How to Add Team Photos

### Step 1: Prepare Your Photos

1. Get photos of Sejal Choudhary and Shreya
2. Recommended specifications:
   - **Size**: 500x500 pixels (square format works best)
   - **Format**: JPG or PNG
   - **Quality**: High resolution, well-lit, professional
   - **File size**: Keep under 500KB for optimal loading

### Step 2: Add Photos to Project

1. Navigate to the `images` folder in your project
2. Add your photos with these exact names:
   - `sejal.jpg` - Photo of Sejal Choudhary
   - `shreya.jpg` - Photo of Shreya

### Step 3: Verify

1. Refresh your browser at http://localhost:5174
2. Click the "Team" icon (👥) in the navbar
3. Your photos should now appear in the team modal

## Customization Options

### Update Social Links

Edit `index.html` and find the team section. Update the `href` attributes:

```html
<!-- For Sejal -->
<a href="https://github.com/sejal-username" class="social-link" title="GitHub">
<a href="https://linkedin.com/in/sejal-profile" class="social-link" title="LinkedIn">

<!-- For Shreya -->
<a href="https://github.com/shreya-username" class="social-link" title="GitHub">
<a href="https://linkedin.com/in/shreya-profile" class="social-link" title="LinkedIn">
```

### Update Roles

Change the role text in `index.html`:

```html
<p class="team-member-role">Co-Developer</p>
```

You can change "Co-Developer" to:
- "Frontend Developer"
- "Full Stack Developer"
- "UI/UX Designer"
- "Project Lead"
- Or any other role

### Add More Team Members

To add additional team members, duplicate this block in `index.html`:

```html
<div class="team-member">
    <div class="team-member-photo">
        <img src="./images/newmember.jpg" alt="New Member" onerror="this.style.display='none'">
    </div>
    <div class="team-member-info">
        <h4 class="team-member-name">New Member Name</h4>
        <p class="team-member-role">Role Title</p>
        <div class="team-member-social">
            <a href="#" class="social-link" title="GitHub">
                <!-- GitHub SVG icon -->
            </a>
            <a href="#" class="social-link" title="LinkedIn">
                <!-- LinkedIn SVG icon -->
            </a>
        </div>
    </div>
</div>
```

## Features

### Current Features

- **Responsive Design**: Works on all screen sizes
- **Hover Effects**: Cards lift and photos zoom on hover
- **Placeholder Icons**: Shows emoji icon if photo is missing
- **Social Links**: GitHub and LinkedIn integration
- **Theme Support**: Adapts to all 10 color themes

### Styling

The team section automatically:
- Uses your selected theme colors
- Displays in a grid layout (2 columns on desktop, 1 on mobile)
- Shows circular profile photos with theme-colored borders
- Includes smooth animations and transitions

## Troubleshooting

### Photos Not Showing?

1. **Check file names**: Must be exactly `sejal.jpg` and `shreya.jpg`
2. **Check file location**: Must be in the `images` folder
3. **Check file format**: Use JPG or PNG
4. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Photos Look Distorted?

- Use square photos (same width and height)
- Crop photos to focus on faces
- Use at least 500x500 pixel resolution

### Want Different Layout?

Edit `style.css` and modify `.team-grid`:

```css
.team-grid {
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  gap: 2rem;
}
```

## Example Photo Preparation

### Using Online Tools

1. **Crop to Square**: Use [Squoosh.app](https://squoosh.app)
2. **Resize**: Set to 500x500 pixels
3. **Optimize**: Reduce file size while maintaining quality
4. **Save**: Export as JPG with 85% quality

### Using Photoshop/GIMP

1. Open your photo
2. Crop to square (1:1 aspect ratio)
3. Resize to 500x500 pixels
4. Export as JPG (quality: 85%)
5. Save as `sejal.jpg` or `shreya.jpg`

---

**Need Help?** Check the `images/README.md` file for additional instructions.
