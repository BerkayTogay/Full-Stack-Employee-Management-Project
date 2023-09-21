import { ISkill } from "./ISkill";

export interface IEmployee
{
    id:number,
    fullName:string,
    startingDate:string,
    contactPreference:string,
    email:string,
    confirmEmail:string,
    phone:number,
    city:string,
    salary:number,
    gender:string,
    departmentAndSkills:ISkill[]

}
