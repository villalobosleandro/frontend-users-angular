import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { UsersService } from './../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  userForm!: FormGroup;
  emailPattern = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,3}';
  phonePattern = '/(7|8|9)\d{9}/';

  constructor(
    public usersService: UsersService, 
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {

   }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      telefono: [''],
      _id: ['']
    });
    this.getUsers();
  }

  getFormControl(name: string | number) {    
    return this.userForm.controls[name].valid && !this.userForm.controls[name].dirty;
  }

  validateNumber(control: AbstractControl) {
    const regex = new RegExp(/^\d+$/);
    return regex.test(control.value) || control.value === null
      ? null
      : {
        isNumber: {
          valid: false
        }
      };
  }

  resetForm() {
    this.userForm.reset();
  }

  getUsers() {
    this.usersService.getUsers().subscribe(
      res => {
        this.usersService.users = res;
      },
      err => {
        console.log('getUsers => ', err);
        
        this.toastr.error(`Error! ${err.error}`);
      }
    );
  }

  addUser() {
    if(this.userForm.controls._id.value) {
      this.usersService.updateUser(this.userForm.value).subscribe(
        res => {
          this.toastr.success("User edited successfully");
          this.getUsers();
          this.userForm.reset();
        },
        err => {
          console.log('editUser => ', err);
          this.toastr.error(`Error! ${err.error}`);
        }
      )
    } else {
      this.usersService.createUser(this.userForm.value).subscribe(
        res => {
          this.toastr.success("User created successfully");
          this.getUsers();
          this.userForm.reset();
        },
        err => {
          console.log('createUser => ', err);
          this.toastr.error(`Error! ${err.error}`);
        }    
      );
    }
  }

  editUser(user: any) {
    this.userForm.controls._id.setValue(user._id);
    this.userForm.controls.nombre.setValue(user.nombre);
    this.userForm.controls.apellido.setValue(user.apellido);
    this.userForm.controls.cedula.setValue(user.cedula);
    this.userForm.controls.email.setValue(user.email);
    this.userForm.controls.telefono.setValue(user.telefono);
  }

  deleteUser(user: object) {
    if (confirm("Are you sure you want to delete it?")) {
      this.usersService.deleteUser(user).subscribe(
        res => {
          this.toastr.success("Deleted successfully");
          this.getUsers();
        },
        err => {
          console.log('deleteUser => ', err);
          this.toastr.error("An error has occurred, try again");
        }
      );
    }
  }
}
