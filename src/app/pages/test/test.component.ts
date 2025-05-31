import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {

  dataForm: FormGroup;

  private readonly fb = inject(FormBuilder);

  private data: any = {
    "name": "Sazib",
    "email": "sazib@gmail.com",
    "desc": "<h1 style=\"color: rgb(85, 85, 85); font-family: kalpurush, sans-serif; text-align: justify; background-color: rgb(255, 255, 255);\"><strong>দুর্বল প্যারেন্টিং –এর ৭ টি কারণ</strong></h1><p style=\"font-family: kalpurush, sans-serif; color: rgb(85, 85, 85); text-align: justify; line-height: 20px; background-color: rgb(255, 255, 255); margin-bottom: 15px !important;\"><br></p><p style=\"font-family: kalpurush, sans-serif; text-align: justify; line-height: 20px; background-color: rgb(255, 255, 255); margin-bottom: 15px !important;\"><font color=\"#d10000\">বাবা-মা হওয়া সহজ, কিন্তু ‘ভালো বাবা-মা’ হওয়া সহজ না। এমনি এমনি কেউ ভালো বাবা-মা হতে পারে না; এটার জন্য দরকার জ্ঞানার্জন, সচেতনতা, অনুশীলন।</font></p><p style=\"font-family: kalpurush, sans-serif; color: rgb(85, 85, 85); text-align: justify; line-height: 20px; background-color: rgb(255, 255, 255); margin-bottom: 15px !important;\"><img src=\"http://localhost:3000/api/upload\\images\\vip-cabin-eb71.png?resolution=368_271\" contenteditable=\"false\" style=\"max-width: 100%; height: auto; width: 30%; display: inline; margin: 0px auto; float: left;\"></p><p style=\"font-family: kalpurush, sans-serif; color: rgb(85, 85, 85); text-align: justify; line-height: 20px; background-color: rgb(255, 255, 255); margin-bottom: 15px !important;\">&nbsp;যেসব কারণে ভালো প্যারেন্টিং হয় না সেগুলো হলো:</p><p style=\"font-family: kalpurush, sans-serif; color: rgb(85, 85, 85); text-align: justify; line-height: 20px; background-color: rgb(255, 255, 255); margin-bottom: 15px !important;\"><strong>&nbsp;১. অজ্ঞতা:&nbsp;</strong>বাবা-মা মনে করেন- “সন্তান প্রতিপালন এ আর এমন কী?&nbsp; &nbsp;এগুলোর ব্যাপারে জানতে হয়? কই, আমাদের বাবা-মামা, দাদা-দাদী তো এসব&nbsp; &nbsp;না জেনেও আমাদেরকে বড় করেছেন?”</p><p style=\"font-family: kalpurush, sans-serif; color: rgb(85, 85, 85); text-align: justify; line-height: 20px; background-color: rgb(255, 255, 255); margin-bottom: 15px !important;\">&nbsp;ভালোভাবে সন্তান প্রতিপালন করতে মা-বাবাকে দুটো বিষয়ে জ্ঞান থাকতেই&nbsp; &nbsp; &nbsp; &nbsp;হবে।</p><p class=\"ql-indent-1\" style=\"font-family: kalpurush, sans-serif; color: rgb(85, 85, 85); text-align: justify; line-height: 20px; background-color: rgb(255, 255, 255); margin-bottom: 15px !important;\">ক. আল্লাহ আমাদেরকে কেন সৃষ্টি করেছেন সে ব্যাপারে পরিষ্কার ধারণা</p><p class=\"ql-indent-1\" style=\"font-family: kalpurush, sans-serif; color: rgb(85, 85, 85); text-align: justify; line-height: 20px; background-color: rgb(255, 255, 255); margin-bottom: 15px !important;\">খ. সমাজ ও সমসাময়িক বিষয়ে জ্ঞান থাকা যাতে সন্তানের কৌতুহল নিবারণ করে তাকে যোগ্য বানানো যায়।</p>"
  }

  ngOnInit() {
    this.dataForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.email]],
      desc: [null, [Validators.required]],
    })
  }

  submitForm() {
    console.log('On Submit')
    console.log(this.dataForm.value)
  }

  onEdit() {
    this.dataForm.patchValue(this.data);
  }
}
