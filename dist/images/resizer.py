from PIL import Image
import os

def resize_images(input_folder, output_folder, new_width=None, new_height=None):
    """
    Resize images while maintaining aspect ratio.
    Specify either new_width or new_height (not both).
    """
    # Create output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # Process each image in the input folder
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
            try:
                # Open the image
                img_path = os.path.join(input_folder, filename)
                img = Image.open(img_path)
                
                # Calculate new dimensions while maintaining aspect ratio
                width, height = img.size
                aspect_ratio = width / height  # Should be 8:1 for your images
                
                if new_width:
                    # Calculate height based on new width
                    new_height = int(new_width / aspect_ratio)
                elif new_height:
                    # Calculate width based on new height
                    new_width = int(new_height * aspect_ratio)
                else:
                    raise ValueError("Either new_width or new_height must be specified")
                
                # Resize the image
                resized_img = img.resize((new_width, new_height), Image.LANCZOS)
                
                # Save the resized image
                output_path = os.path.join(output_folder, filename)
                resized_img.save(output_path)
                print(f"Resized {filename} to {new_width}x{new_height}")
                
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")

if __name__ == "__main__":
    # Configuration
    input_folder = "Atlas_Ascension\\dist\\images\\hesperia"  # Replace with your input folder path
    output_folder = "Atlas_Ascension\\dist\\images\\hesperia"  # Replace with your output folder path
    
    # Choose ONE of these options:
    # Option 1: Set desired width (height will be calculated)
    new_width = 768  # Example: resize to 2048x256 (maintains 8:1 ratio)
    
    # Option 2: Set desired height (width will be calculated)
    # new_height = 192  # Example: resize to 1536x192 (maintains 8:1 ratio)
    
    # Run the resizing
    resize_images(input_folder, output_folder, new_width=new_width)
    # OR if using height:
    # resize_images(input_folder, output_folder, new_height=new_height)