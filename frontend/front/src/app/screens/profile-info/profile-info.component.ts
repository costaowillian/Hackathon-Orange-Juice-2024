import { Component } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-profile-info",
  templateUrl: "./profile-info.component.html",
  styleUrls: ["./profile-info.component.scss"],
})
export class ProfileInfoComponent {
  visibilityNew: boolean = false;
  visibilityOld: boolean = false;
  password: string = "password";

  formProfile!: FormGroup;

  formPassword!: FormGroup;

  loading: boolean = false;
  hasError: string = "";

  selectedImage: string | undefined;
  formData = new FormData();

  constructor(private formBuilder: NonNullableFormBuilder) {}

  ngOnInit() {
    this.formProfile = this.formBuilder.group({
      name: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      country: ["", [Validators.required]],
    });
    this.formPassword = this.formBuilder.group({
      oldPassword: ["", [Validators.required]],
      newPassword: ["", [Validators.required]],
    });
  }

  formErrorMessage(fieldName: string) {
    const field = this.formProfile.get(fieldName);
    if (field?.hasError("required")) {
      return "Este campo é necessário";
    }
    if (field?.hasError("email")) {
      return "Endereço de email inválido";
    }
    return;
  }

  formErrorMessagePassword(fieldName: string) {
    const field = this.formPassword.get(fieldName);
    if (field?.hasError("required")) {
      return "Este campo é necessário";
    }
    return;
  }

  triggerFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (this.formData.has("imgUrl")) {
        this.formData.delete("imgUrl");
      }

      this.formData.append("imgUrl", selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  onClick(iten: string) {
    if (iten == "new") {
      this.visibilityNew = !this.visibilityNew;
      if (this.password === "text") {
        this.password = "password";
      } else if (this.password === "password") {
        this.password = "text";
      }
    } else {
      this.visibilityOld = !this.visibilityOld;
      if (this.password === "text") {
        this.password = "password";
      } else if (this.password === "password") {
        this.password = "text";
      }
    }
  }
}
