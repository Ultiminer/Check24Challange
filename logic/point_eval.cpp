#include <iostream>
/*
structure:
<bet_1>:<bet_2> ; <res_1>:<res_2>
*/
struct vec2{
    short a; 
    short b; 
};
constexpr int sign_cmp(int x){

 if(x>0)return 1; 
 if(x<0)return -1;
 
 return 0;
}
int main(int argc, char** argv)
{
    if(argc!=5)return 0; 
    const vec2 guess{(short)atoi(argv[1]),(short)atoi(argv[2])};
    const vec2 res{(short)atoi(argv[3]),(short)atoi(argv[4])};

    if(guess.a==res.a&&guess.b==res.b){std::cout<<8;return 0;}
    if(guess.a!=guess.b&&guess.a-guess.b==res.a-res.b  ){std::cout<<6;return 0;}
    if(sign_cmp(guess.a-guess.b)==sign_cmp(res.a-res.b)  ){std::cout<<4;return 0;}

    {std::cout<<0;return 0;} 
}