const input = document.getElementById("profile-image");
const preview = document.getElementById("image-preview");
const plusIcon = document.getElementById("plus-icon");

input.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      plusIcon.style.display = "none";
      preview.style.backgroundImage = `url(${e.target.result})`;
      preview.style.backgroundSize = "cover";
      preview.style.backgroundPosition = "center";
    };

    reader.readAsDataURL(file);
  }
});
