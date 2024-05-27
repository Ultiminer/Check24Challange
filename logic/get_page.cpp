#include <fstream>
#include <string>
#include <iostream>
/*ARGS: STD, FILENAME, PAGE_NUM, LINES_PER_PAGE*/
/*
Program sends requested pages to standard output. First page is starting at zero!!
*/

inline void LoadPage(const std::string& path, const int pageNum, const int linPerPage)
{
    std::ifstream in{path};
    std::string line="";
    int count=0;
    std::string data="";
    while((count<(pageNum+1)*linPerPage)&&std::getline(in,line))
    {
        if(count>=(pageNum)*linPerPage)data+=line+"\n"; 
        count++;
        line=""; 
    }
    in.close();
   std::cout<<data; 
}

int main(int argc, char**argv)
{
    if(argc<4)return 0; 
    LoadPage(argv[1],std::atoi(argv[2]),std::atoi(argv[3]));

    return 0; 
}