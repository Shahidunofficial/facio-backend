

@contorller(studentsAuth);
export class StudentsController{


    @Post('studentLogin')
    async loginStudent(@Body() studentLoginDTO: StudentLoginDTO){
        return this.studentsAuthService.loginStudent(studentLoginDTO);
    }

    
}