/*Programm needs (1) path (2) line in json*/
#include <fstream>
#include <string>


bool CanInsert(const std::string& line, const std::string& str)
{
    std::string numLine="";
    std::string numStr="";
    for(auto& el:line)if(el>='0'&&el<='9')numLine+=el;
    for(auto& el:str)if(el>='0'&&el<='9')numStr+=el;


    return std::atoi(numLine.c_str())>std::atoi(numStr.c_str());
}
void WriteFile(const char* path, std::string str)
{
std::ifstream read{path};
std::string line;
std::string data;
bool first=true;
while (std::getline(read,line))
{    
    if(line!=""){
    if(first&&CanInsert(line,str)){data+="\n"+str; first=false;}
    data+="\n"+line;
    }
    line =""; 
}
if(first)data+="\n"+str;
read.close();
std::ofstream write{path,std::ios::trunc};
data.erase(data.begin());
write<<data;
write.close();
}
int main(int argc, char**argv)
{
    if(argc<3)return 0; 
    WriteFile(argv[1],argv[2]);
}