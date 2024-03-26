all:
	@windres src/icon.rc -O coff -o src/icon.o
	@g++ -Isrc/include -Lsrc/lib -o run.exe main.cpp src/icon.o -lmingw32 -lSDL2main -lSDL2 -static-libgcc -static-libstdc++
	@echo Compilation complete
clean:
	@rm -f src/icon.o
	@rm -f run.exe
	@echo "Cleaned"
